import asyncMiddleware from '~/server/middlewares/response/async-middleware.js';
import { sequelizeConfig } from '../../../lib/sequelize.js';
import _ from 'lodash';

import {
  ChargeTransactionThroughCustomerId,
  RefundTransaction,
  ChargeTransactionThroughNonce,
} from '../../../lib/braintree.js';

import hasPermission from '../../../middlewares/has-permission.js';
import { generateRandomPassword } from '~/server/lib/common.js';
import { ReservationCalculation } from '~/utils/index.js';
import { Regex } from '~/server/enums.js';
import db from '~/server/models/index.js';
const {
  Affiliates,
  Cars,
  Configurations,
  ReservationAddons,
  ReservationDetails,
  ReservationDiscountCodes,
  ReservationExtraStops,
  ReservationSurges,
  Reservations,
  ReservationsPayments,
  Sequelize,
  Users,
  UserRoles,
  Roles,
} = db;

const CHECKING_LOCATIONS = {
  toAirport: 'fromAirport',
  fromAirport: 'toAirport',
};

import SendMail from '../../../lib/email-sender/index.js';
import { PERMISSIONS } from '../../../permissions.js';
import express from 'express';

const router = express.Router();

router
  .route('/')
  .get(
    [hasPermission(PERMISSIONS.reservationsView)],
    asyncMiddleware(async (req, res) => {
      if (req.user.isDriver) {
        return res.redirect(
          '/api/v1/reservations/drivers?limit=50&offset=0'
        );
      }

      const query = {
        ...req.query,
        where: {
          status: {
            [Sequelize.Op.notIn]: ['draft', 'cancelled'],
          },
        },
        order: sequelizeConfig.Order.Desc('pickUpDateTime'),
        include: [
          {
            model: Users,
            as: Users.$$singularName,
          },
        ],
      };

      if (req.user.dataValues.isAdmin) {
        if (req.query.toDate) {
          query.where[req.query.filterDate || 'pickUpDateTime'] = {
            [Sequelize.Op.between]: [
              req.query.fromDate,
              req.query.toDate,
            ],
          };
        }
      } else {
        query.where.userId = req.user.id;
      }

      if (req.query.status) {
        query.where.status = {
          [Sequelize.Op.in]: req.query.status.split(','),
        };
      }

      let search = req.query.search || '';
      if (search.match(Regex.reservation)) {
        search = search.toUpperCase().replace('A', '');
      }

      if (search) {
        const likeObject = {
          [Sequelize.Op.like]: `${search}%`,
        };

        query.where[Sequelize.Op.or] = [
          'id',
          'name',
          'email',
          'paymentType',
          'pickUpLocation',
          'dropOffLocation',
          'affiliateName',
          'phoneNumber',
          'comments',
        ].map((key) => ({ [key]: likeObject }));
      }

      const reservations = await Reservations.findAndCountAll(query);
      return res.http200(reservations.rows, {
        count: reservations.count,
      });
    })
  )
  .post(
    [hasPermission(PERMISSIONS.reservationsCreate)],
    asyncMiddleware(async (req, res) => {
      let request = req.body;
      const email = request.email;
      const existingUser = await Users.$$findOne({
        query: {
          where: {
            email: email,
          },
        },
        throwError: false,
      });

      if (!existingUser) {
        const newUser = await Users.create({
          email: email,
          password: generateRandomPassword(),
          firstName: request.name,
          phoneNumber: request.phoneNumber,
          isCreatedAtReservation: true,
        });

        const userRole = await Roles.$$findOne({
          query: {
            where: {
              name: 'customer',
            },
          },
        });

        await UserRoles.create({
          roleId: userRole.id,
          userId: newUser.dataValues.id,
        });
        request.userId = newUser.id;
      } else {
        request.userId = existingUser.id;
      }

      const configuration = (
        await Configurations.$$findOne({
          query: {
            where: {},
            order: sequelizeConfig.Order.Desc(),
          },
        })
      ).configs;
      const isUnpaid = request.status === 'unpaid';
      const MaxMilesSurgeConfig = configuration.maxMilesSurge;
      const ExtraStopsAmount = configuration.extraStopCharges.amount;
      const MeetAndGreetConfig = configuration.meetAndGreet;
      const isRoundTrip = request.isRoundTrip;

      let isMeetAndGreetForParent = isRoundTrip
        ? ['fromAirport', 'pointToPoint'].includes(
            request.checkingLocation
          )
        : true;
      // Draft Section Start
      const isDraft = request.status === 'draft';
      if (isDraft) {
        request.amount = request.draftPayload.totalBill;
        let reservation = {};

        if (!request.draftId) {
          reservation = await Reservations.create(request);
        } else {
          reservation = await Reservations.$$findOne({
            query: {
              where: { id: request.draftId },
            },
          });

          reservation = await reservation.update(request);
        }

        return res.http200({ reservation });
      }
      // Draft Section End

      // Amount Calculation Start
      let customGratuity = request.customGratuity;
      let roundTripAmount = 0;
      let extraMilesAmount = 0;

      if (isRoundTrip) {
        customGratuity = customGratuity / 2;
        const extraStopsAmount = (request.returnExtraStops || [])
          .length
          ? ExtraStopsAmount
          : 0;

        request.discounts.forEach((discount) => {
          discount.amount = discount.amount / 2;
        });

        // roundtrip => amount

        const roundTripPayload = ReservationCalculation({
          cars: request.cars,
          customGratuity,
          discounts: request.discounts,
          eStops: request.returnExtraStops,
          extraMilesAmount: 0,
          extraStopsAmount,
          gratuity: request.gratuity,
          isMeetAndGreet:
            request.isMeetAndGreet && !isMeetAndGreetForParent,
          meetAndGreet: MeetAndGreetConfig,
          miles: request.childMiles,
          surges: request.returnSurges,
        });
        roundTripAmount = roundTripPayload.tripBill;
      } else if (request.parentMiles > MaxMilesSurgeConfig.maxMiles) {
        extraMilesAmount = MaxMilesSurgeConfig.amount;
      }

      let extraStopsAmount = (request.extraStops || []).length
        ? ExtraStopsAmount
        : 0;

      const oneWayTripPayload = ReservationCalculation({
        cars: request.cars,
        customGratuity,
        discounts: request.discounts,
        eStops: request.extraStops,
        extraMilesAmount,
        extraStopsAmount,
        gratuity: request.gratuity,
        isMeetAndGreet:
          request.isMeetAndGreet && isMeetAndGreetForParent,
        meetAndGreet: MeetAndGreetConfig,
        miles: request.parentMiles,
        surges: request.surges,
      });
      const tripAmount = oneWayTripPayload.tripBill;

      const totalAmount = (roundTripAmount + tripAmount).toFixed(2);
      // Amount Calculation End

      // Payment Section Start
      let paymentDetails = {};
      const nonce = (request.paymentDetails || {}).nonce;
      if (nonce) {
        request.paymentType = 'braintree';
        paymentDetails = await ChargeTransactionThroughNonce({
          amount: totalAmount,
          nonce: nonce,
          email: request.email,
          name: request.name,
          phoneNumber: request.phoneNumber,
        });

        request.transactionId = _.get(
          paymentDetails,
          'transaction.id',
          null
        );

        request.customerId = _.get(
          paymentDetails,
          'transaction.customer.id',
          null
        );
      }

      const paypalCustomerId = _.get(
        request.paymentDetails,
        // 'payer.payer_info.payer_id',
        'payer.payer_id',
        null
      );

      if (paypalCustomerId) {
        request.paymentType = 'paypal';
        request.customerId = paypalCustomerId;
        paymentDetails = request.paymentDetails;
        // request.transactionId = _.get(
        //   request.paymentDetails,
        //   'transactions[0].related_resources[0].sale.id',
        //   null
        // );
        request.transactionId = _.get(
          request.paymentDetails,
          'transactionId',
          null
        );
      }

      if (!isUnpaid) {
        const isTransactionIdAlreadyExist =
          await Reservations.$$findOne({
            query: {
              where: {
                transactionId: request.transactionId,
              },
            },
            throwError: false,
          });

        if (isTransactionIdAlreadyExist || !request.transactionId) {
          return res.http500('Payment Not Verified');
        }
      }
      // Payment Section End

      let roundTripReservation = null;
      let roundTripReservationDetails = null;

      const DefaultReservationObject = {
        name: request.name,
        phoneNumber: request.phoneNumber,
        internationalPhoneNumber: request.internationalPhoneNumber,
        email: request.email,
        userId: request.userId,
        noOfPassenger: request.noOfPassenger,
        affiliateId: request.affiliateId,
        affiliateName: request.affiliateName,
        hotelName: request.hotelName,
        status: request.status,
        isRoundTrip: false,
        gratuity: request.gratuity,
        customGratuity,
        paymentType: request.paymentType,
        customerId: request.customerId,
        transactionId: request.transactionId,
        isBagsChecked: request.isBagsChecked,
      };

      if (isRoundTrip) {
        roundTripReservation = await Reservations.create({
          ...DefaultReservationObject,
          amount: roundTripAmount,
          checkingLocation:
            CHECKING_LOCATIONS[request.checkingLocation],
          comments: request.returnFlightComments,
          dropOffLocation: request.pickUpLocation,
          flightNumber: request.returnFlightNumber,
          isMeetAndGreet:
            request.isMeetAndGreet && !isMeetAndGreetForParent,
          meetAndGreet: MeetAndGreetConfig,
          miles: request.childMiles,
          pickUpDateTime: request.returnPickUpDateTime,
          pickUpLocation: request.dropOffLocation,
        });

        const carsAfterAddingDriversAmount =
          Reservations.calculateDriversAmount(
            request.cars,
            roundTripReservation.dataValues.miles,
            roundTripAmount,
            (extraMilesAmount = 0)
          );

        roundTripReservationDetails =
          await roundTripReservation.addDetails({
            discounts: request.discounts,
            surges: request.returnSurges,
            extraStops: request.returnExtraStops,
            cars: carsAfterAddingDriversAmount,
          });
      }

      let reservation = await Reservations.create({
        ...DefaultReservationObject,
        amount: tripAmount,
        checkingLocation: request.checkingLocation,
        comments: request.comments,
        dropOffLocation: request.dropOffLocation,
        extraMilesAmount: extraMilesAmount,
        flightNumber: request.flightNumber,
        isMeetAndGreet:
          request.isMeetAndGreet && isMeetAndGreetForParent,
        meetAndGreet: MeetAndGreetConfig,
        miles: request.parentMiles,
        pickUpDateTime: request.pickUpDateTime,
        pickUpLocation: request.pickUpLocation,
      });

      const carsAfterAddingDriversAmount =
        Reservations.calculateDriversAmount(
          request.cars,
          reservation.dataValues.miles,
          tripAmount,
          extraMilesAmount
        );

      const details = await reservation.addDetails({
        discounts: request.discounts,
        surges: request.surges,
        extraStops: request.extraStops,
        cars: carsAfterAddingDriversAmount,
      });

      if (isRoundTrip) {
        reservation.update({
          parentOf: roundTripReservation.id,
        });

        roundTripReservation.update({
          childOf: reservation.id,
        });
      }

      if (nonce || paypalCustomerId) {
        const createPaymentAndSendEmail =
          createReservationPaymentAndSendEmail({
            paymentDetails,
            email: req.body.email,
            cars: request.cars,
          });

        createPaymentAndSendEmail(reservation, details);

        if (isRoundTrip) {
          createPaymentAndSendEmail(
            roundTripReservation,
            roundTripReservationDetails
          );
        }
      }

      res.http200({ reservation, ...details });
    })
  );

// TODO: we need to upgrade this API
router.get(
  '/drivers',
  [hasPermission(PERMISSIONS.driversView)],
  asyncMiddleware(async (req, res) => {
    const reservationDetails = await ReservationDetails.findAll({
      where: {
        driverId: req.user.id,
      },
    });

    const reservationIds = _.chain(reservationDetails)
      .map('reservationId')
      .uniq()
      .value();

    const query = {
      ...req.query,
      where: {
        id: {
          [Sequelize.Op.in]: reservationIds,
        },
      },
      order: sequelizeConfig.Order.Desc(),
      include: [
        {
          model: Users,
          as: Users.$$singularName,
        },
      ],
    };

    if (req.query.search) {
      query.where[Sequelize.Op.or] = [
        {
          id: {
            [Sequelize.Op.like]: `${req.query.search}%`,
          },
        },
        {
          name: {
            [Sequelize.Op.like]: `${req.query.search}%`,
          },
        },
        {
          email: {
            [Sequelize.Op.like]: `${req.query.search}%`,
          },
        },
      ];
    }

    if (req.query.toDate) {
      query.where.createdAt = {
        [Sequelize.Op.between]: [
          req.query.toDate,
          req.query.fromDate,
        ],
      };
    }

    const reservations = await Reservations.findAndCountAll(query);
    return res.http200(reservations.rows, {
      count: reservations.count,
    });
  })
);

router.put(
  '/:reservationId/assign-drivers',
  [hasPermission(PERMISSIONS.reservationsAssign)],
  asyncMiddleware(async (req, res) => {
    const { reservationId } = req.params;
    let { shouldSendEmail } = req.query;
    const reservationDetails = req.body;
    let previousDriverIds = [];
    let newDrivers = [];
    let assignDriverName = [];

    reservationDetails.forEach((item) => {
      assignDriverName.push(item.user.fullName);
      if (!item.driverId) {
        return newDrivers.push(item.user);
      }

      if (item.driverId !== item.user.id) {
        previousDriverIds.push(item.driverId);
        newDrivers.push(item.user);
      }
    });

    assignDriverName = assignDriverName.join(', ');

    const updatedReservationDetails = reservationDetails.map(
      (item) => {
        return ReservationDetails.update(
          {
            driverId: item.user.id,
          },
          {
            where: {
              id: item.id,
            },
          }
        );
      }
    );

    await Promise.all(updatedReservationDetails);

    await Reservations.update(
      {
        assignedDrivers: assignDriverName,
      },
      { where: { id: reservationId } }
    );

    const rsd = await ReservationDetails.findAll({
      where: { reservationId: reservationId },
      include: [
        {
          model: Users,
          as: Users.$$singularName,
        },
        {
          model: Cars,
          as: Cars.$$singularName,
        },
      ],
    });

    const previousDrivers = await Users.findAll({
      where: {
        id: {
          [Sequelize.Op.in]: previousDriverIds,
        },
      },
    });

    const reservation = await Reservations.findOne({
      where: { id: reservationId },
    });

    const extraStops = await ReservationExtraStops.findAll({
      where: { reservationId: reservationId },
    });

    if (
      reservation.status !== 'assigned' &&
      rsd.every((item) => item.driverId)
    ) {
      await Reservations.update(
        {
          status: 'assigned',
        },
        {
          where: {
            id: reservationId,
          },
        }
      );
    }

    if (shouldSendEmail) {
      SendMail('driver-assigned-to-user', {
        to: reservation.email,
        subject: `Driver has been Assigned RES#${reservation.number} `,
        variables: {
          reservation: reservation,
          detail: rsd.filter((d) => d.user),
          sentToAdmin: true,
          status: 'Assigned',
          extraStops:
            Reservations.formattedExtraStops(extraStops) || null,
        },
      });
    }

    previousDrivers.forEach((item) => {
      SendMail('assign-deassign-driver', {
        to: item.email,
        subject: `Driver has been Unassigned RES#${reservation.number} `,
        variables: {
          reservation,
          driverName: item.fullName,
          status: 'Unassigned',
          isAssigned: true,
          bookedCars: Reservations.formattedFilterCars(rsd),
          extraStops: null,
        },
      });
    });

    newDrivers.forEach((item) => {
      SendMail('assign-deassign-driver', {
        to: item.email,
        subject: `Driver has been Assigned RES#${reservation.number} `,
        variables: {
          reservation,
          driverName: item.fullName,
          status: 'Assigned',
          isAssigned: true,
          bookedCars: Reservations.formattedFilterCars(rsd),
          extraStops:
            Reservations.formattedExtraStops(extraStops) || null,
        },
      });
      SendMail('message-to-driver', {
        to: item.phoneNumberAsEmail,
        subject: `${process.env.APP_NAME_PASCAL_CASE}(Res.Assigned)`,
        variables: {
          reservation,
          extraStops:
            Reservations.formattedExtraStops(extraStops) || null,
        },
      });
    });

    res.http200('Drivers assigned successfully!');
  })
);

router.route('/:reservationId/addons').post(
  [hasPermission(PERMISSIONS.reservationsAddAddon)],
  asyncMiddleware(async (req, res) => {
    let amountWithAddon = 0;
    const amount = +req.body.amount;

    const reservation = await Reservations.$$findByPk({
      id: +req.params.reservationId,
    });
    const reservationAmount = +reservation.amount;

    if (amount) {
      amountWithAddon = reservationAmount + amount;
      delete req.body.percentage;
    } else {
      let amountWithPercentage = 0;
      amountWithPercentage =
        reservationAmount * (+req.body.percentage / 100);
      amountWithAddon = reservationAmount + amountWithPercentage;
    }

    await reservation.update({ amount: amountWithAddon });

    const reservationAddon = await ReservationAddons.create({
      ...req.body,
      reservationId: req.params.reservationId,
    });

    if (
      reservation.customerId &&
      reservation.paymentType === 'braintree'
    ) {
      ChargeTransactionThroughCustomerId({
        amount: req.body.amount,
        customerId: reservation.customerId,
      });
    }

    return res.http200(reservationAddon);
  })
);

router.route('/:reservationId/change-status/:status').put(
  [hasPermission(PERMISSIONS.reservationsChangeStatus)],
  asyncMiddleware(async (req, res) => {
    const { status } = req.params;
    const { shouldSendRatingLink, notifyEmail } = req.body;
    const query = {
      where: {
        id: req.params.reservationId,
      },
    };
    const reservation = await Reservations.findOne(query);
    const updatedreservation = await reservation.update({
      status,
    });
    const details = await ReservationDetails.findAll({
      where: {
        reservationId: req.params.reservationId,
      },
    });
    const extraStops = await ReservationExtraStops.findAll({
      where: {
        reservationId: req.params.reservationId,
      },
    });
    if (shouldSendRatingLink) {
      SendMail('reservation-rate-and-review', {
        to: updatedreservation.email,
        subject: `Reservation #${reservation.number}, Rate & Review Request`,
        variables: {
          status,
          reservation: reservation,
          startCaseStatus: _.startCase(status),
          name: updatedreservation.name,
          id: req.params.reservationId,
        },
      });
    } else if (
      /*(status === 'completed') ||*/ status === 'cancelled' &&
      notifyEmail
    ) {
      SendMail('reservation-change-status', {
        to: updatedreservation.email,
        subject: `Reservation # ${
          updatedreservation.number
        } has been ${_.startCase(status)}`,
        variables: {
          status,
          reservation: updatedreservation,
          amount: updatedreservation.dataValues.amount.toFixed(2),
          bookedCars: Reservations.formattedFilterCars(details),
          extraStop:
            Reservations.formattedExtraStops(extraStops) || null,
          name: updatedreservation.name,
          id: req.params.reservationId,
          sentToAdmin: true,
        },
      });
    }

    return res.http200(updatedreservation);
  })
);

router.post(
  '/:reservationId/proceed-to-reservation',
  [hasPermission(PERMISSIONS.reservationsEdit)],
  asyncMiddleware(async (req, res) => {
    const reservationId = req.params.reservationId;
    req.body.status = 'created';

    delete req.body.id;
    await Reservations.destroy({
      where: {
        id: reservationId,
      },
    });

    return res.redirect(307, '/api/v1/reservations');
  })
);

router.delete(
  '/addons/:addonId',
  [hasPermission(PERMISSIONS.reservationsDeleteAddon)],
  asyncMiddleware(async (req, res) => {
    const reservationDetailAddon = await ReservationAddons.$$findByPk(
      {
        id: +req.param.addonId,
      }
    );
    req.reservationDetailAddon = reservationDetailAddon;
    await ReservationAddons.destroy({
      where: { id: req.query.addonId },
    });
    return res.http200(
      'Addon removed from reservation successfully!'
    );
  })
);

router.post(
  '/:reservationId/refund-payment',
  [hasPermission(PERMISSIONS.reservationsCreate)],
  asyncMiddleware(async (req, res) => {
    const { amount } = req.body;
    const query = {
      query: {
        where: {
          reservationId: req.params.reservationId,
        },
      },
    };

    const reservationPaymentDetail =
      await ReservationsPayments.$$findOne(query);
    const transactionId = _.get(
      reservationPaymentDetail,
      'detail.transaction.id',
      null
    );

    if (!transactionId) {
      throw 'No transaction found!';
    }

    const result = await RefundTransaction({
      id: transactionId,
      amount: amount,
    });
    return res.http200(result);
  })
);

router.param(
  'reservationId',
  asyncMiddleware(async (req, res, next, reservationId) => {
    const reservation = await Reservations.$$findByPk({
      id: +reservationId,
    });
    req.reservation = reservation;
    next();
  })
);
router
  .route('/:reservationId')
  .get(
    [hasPermission(PERMISSIONS.reservationsView)],
    asyncMiddleware(async (req, res) => {
      const query = {
        where: {
          id: req.params.reservationId,
        },
        order: sequelizeConfig.Order.Desc(),
        include: [
          {
            model: Users,
            as: Users.$$singularName,
          },
          {
            model: ReservationAddons,
            as: ReservationAddons.$$name,
          },
          {
            model: Affiliates,
            as: Affiliates.$$singularName,
          },
          {
            model: ReservationExtraStops,
            as: ReservationExtraStops.$$name,
          },
          // Todo: need to make sure that we need this or not
          // {
          //     model: ReservationsPayments,
          //     as: ReservationsPayments.$$name,
          // },
          {
            model: ReservationDiscountCodes,
            as: ReservationDiscountCodes.$$name,
          },
          {
            model: ReservationSurges,
            as: ReservationSurges.$$name,
          },
          {
            model: ReservationDetails,
            as: ReservationDetails.$$name,
            include: [
              {
                model: Users,
                as: Users.$$singularName,
              },
              {
                model: Cars,
                as: Cars.$$singularName,
              },
            ],
          },
        ],
      };
      const reservation = await Reservations.findOne(query);

      return res.http200(reservation);
    })
  )

  .put(
    [hasPermission(PERMISSIONS.reservationsEdit)],
    asyncMiddleware(async (req, res) => {
      let reservationId = req.params.reservationId;
      const {
        email,
        shouldSendEmail,
        name,
        phoneNumber,
        pickUpDateTime,
        flightNumber,
        comments,
        internationalPhoneNumber,
      } = req.body;

      const reservationDetail = req.body.ReservationDetails;
      req.body;

      // if (shouldSendEmail) {
      //     SendMail('reservation-updated', {
      //         to: email,
      //         subject: 'Reservation has been updated',
      //         variables: {
      //             userName: name,
      //         },
      //     });
      // }
      const previousReservation = await Reservations.findOne({
        where: { id: reservationId },
      });

      const updatedReservation = await req.reservation.update({
        name,
        email,
        phoneNumber,
        pickUpDateTime,
        comments,
        flightNumber,
        internationalPhoneNumber,
      });

      const updatedValues = {};
      [
        'name',
        'email',
        'phoneNumber',
        'comments',
        'flightNumber',
        'internationalPhoneNumber',
      ].forEach((key) => {
        if (previousReservation[key] !== updatedReservation[key]) {
          updatedValues[`${key}Updated`] = true;
        }
      });

      if (
        `${previousReservation['pickUpDateTime']}` !==
        `${updatedReservation['pickUpDateTime']}`
      ) {
        updatedValues['pickUpDateTimeUpdated'] = true;
      }

      if (shouldSendEmail) {
        SendMail('reservation-updated', {
          to: email,
          subject: `Reservation # ${updatedReservation.number} Updated`,
          variables: {
            reservation: updatedReservation,
            objDetails: updatedReservation.details,
            sentToAdmin: true,
            bookedCars: Reservations.formattedFilterCars(
              Reservations.getExpectedCars(reservationDetail)
            ),
            updatedValues: updatedValues,
          },
        });
      }

      return res.http200(updatedReservation);
    })
  );
// .delete
// [hasPermission('reservations:delete')],
// asyncMiddleware(async (req, res) => {
//     const ids = [...(req.query.ids || []), req.params.reservationId];
//     await Reservations.destroy({ where: { id: ids } });
//     return res.http200('Deleted Reservation successfully!');
// })
// ();

router.put(
  '/:userId/mark-as-paid',
  [hasPermission(PERMISSIONS.reservationsEdit)],
  asyncMiddleware(async (req, res) => {
    const reservationIds = req.body;

    if (!reservationIds.length) {
      return res.http500('Reservations Already Paid');
    }

    await ReservationDetails.update(
      {
        isPaid: true,
      },
      {
        where: {
          id: reservationIds,
          driverId: req.params.userId,
        },
      }
    );
    return res.http200('Reservations Mark as Paid');
  })
);

export default router;

function createReservationPaymentAndSendEmail({
  paymentDetails,
  email,
  cars,
}) {
  return function (reservation, details) {
    ReservationsPayments.create({
      reservationId: reservation.id,
      detail: paymentDetails,
    });
    SendMail('reservation-created', {
      to: email,
      subject: `Reservation # ${reservation.number} has been made `,
      variables: {
        reservation: reservation,
        sentToAdmin: true,
        objDetails: details,
        amount: reservation.dataValues.amount.toFixed(2),
        bookedCars: Reservations.formattedFilterCars(cars),
        extraStop:
          Reservations.formattedExtraStops(details.extraStops) ||
          null,
      },
    });
  };
}
