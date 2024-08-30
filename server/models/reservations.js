import { getSetMethods } from '../lib/sequelize.js';
import _ from 'lodash'

function appendCharachterBeforeReservationId(id) {
    return id ? `A${id}` : null;
}

export default function (sequelize, DataTypes) {
    let _models = {};
    const { STRING, INTEGER, DATE, VIRTUAL, TEXT, BOOLEAN, FLOAT } = DataTypes;
    const Reservations = sequelize.$$defineModel(
        'Reservations',
        {
            userId: {
                type: INTEGER,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            affiliateId: {
                type: INTEGER,
            },
            name: {
                type: STRING,
            },
            email: {
                type: STRING,
            },
            affiliateName: {
                type: STRING,
            },
            isRoundTrip: {
                type: BOOLEAN,
            },
            parentOf: {
                type: FLOAT,
            },
            childOf: {
                type: FLOAT,
            },
            isMeetAndGreet: {
                type: BOOLEAN,
            },
            extraMilesAmount: {
                type: INTEGER,
            },
            status: {
                type: STRING,
                defaultValue: 'created',
                ...getSetMethods.call(this, 'status'),
            },
            pickUpDateTime: {
                type: DATE,
            },
            returnPickUpDateTime: {
                type: DATE,
            },
            customerId: {
                type: STRING,
            },
            paymentType: {
                type: STRING,
            },
            transactionId: {
                type: STRING,
            },
            hotelName: {
                type: STRING,
            },
            pickUpLocation: {
                type: STRING,
            },
            checkingLocation: {
                type: STRING,
            },
            dropOffLocation: {
                type: STRING,
            },
            meetAndGreet: {
                type: TEXT,
                set: function (value) {
                    this.setDataValue('meetAndGreet', JSON.stringify(value));
                },
                get: function () {
                    return this.getDataValue('meetAndGreet')
                        ? JSON.parse(this.getDataValue('meetAndGreet'))
                        : {};
                },
            },
            phoneNumber: {
                type: STRING,
            },
            assignedDrivers: {
                type: STRING,
            },
            noOfPassenger: {
                type: INTEGER,
            },
            draftPayload: {
                type: TEXT,
                set: function (value) {
                    this.setDataValue('draftPayload', JSON.stringify(value));
                },
                get: function () {
                    return this.getDataValue('draftPayload')
                        ? JSON.parse(this.getDataValue('draftPayload'))
                        : {};
                },
            },
            flightNumber: {
                type: STRING,
            },
            miles: {
                type: FLOAT,
            },
            comments: {
                type: STRING,
            },
            gratuity: {
                type: FLOAT,
            },
            customGratuity: {
                type: FLOAT,
            },
            amount: {
                type: FLOAT,
            },
            isBagsChecked: {
                type: BOOLEAN,
            },
            internationalPhoneNumber: {
                type: STRING,
            },
            number: {
                type: VIRTUAL,
                get: function () {
                    return appendCharachterBeforeReservationId(this.getDataValue('id'));
                },
            },
            parentOfNumber: {
                type: VIRTUAL,
                get: function () {
                    return appendCharachterBeforeReservationId(
                        this.getDataValue('parentOf')
                    );
                },
            },
            childOfNumber: {
                type: VIRTUAL,
                get: function () {
                    return appendCharachterBeforeReservationId(
                        this.getDataValue('childOf')
                    );
                },
            },
        },
        {
            validate: {},
        }
    );
    Reservations.associate = (models) => {
        _models = models;
        Reservations.belongsTo(models.Users, {
            foreignKey: 'userId',
            as: models.Users.$$singularName,
        });
        Reservations.hasMany(models.ReservationDetails, {
            foreignKey: 'reservationId',
            as: models.ReservationDetails.$$name,
        });
        Reservations.hasMany(models.ReservationDiscountCodes, {
            foreignKey: 'reservationId',
            as: models.ReservationDiscountCodes.$$name,
        });
        Reservations.hasMany(models.ReservationSurges, {
            foreignKey: 'reservationId',
            as: models.ReservationSurges.$$name,
        });
        Reservations.hasMany(models.ReservationAddons, {
            foreignKey: 'reservationId',
            as: models.ReservationAddons.$$name,
        });
        Reservations.hasMany(models.ReservationsPayments, {
            foreignKey: 'reservationId',
            as: models.ReservationsPayments.$$name,
        });
        Reservations.hasMany(models.ReservationExtraStops, {
            foreignKey: 'reservationId',
            as: models.ReservationExtraStops.$$name,
        });
        Reservations.belongsTo(models.Affiliates, {
            foreignKey: 'affiliateId',
            as: models.Affiliates.$$singularName,
        });
    };

    (Reservations.formattedFilterCars = function (carsArray) {
        carsArray = _.uniqBy(carsArray, 'name');
        return carsArray.length < 2
            ? carsArray[0].name
                ? `<strong style="color: #D32F2F"> ${carsArray[0].name}: </strong>${carsArray[0].requiredCars}`
                : ' '
            : carsArray
                .map(
                    (s, i) =>
                        `${
                            s.name ? '<br>' : ''
                        } <strong style="margin-left:12px; color: #D32F2F"> ${
                            s.name
                        }: </strong>${s.requiredCars}`
                )
                .join('');
    }),
    (Reservations.getExpectedCars = function (cars = []) {
        const requiredCars = [];
        cars.forEach((car) => {
            const existingCar = requiredCars.find((c) => c.name === car.name);
            if (existingCar) {
                existingCar.requiredCars += 1;
            } else {
                requiredCars.push({ ...car, requiredCars: 1 });
            }
        });
        return requiredCars;
    });
    (Reservations.formattedExtraStops = function (extraStops) {
        return extraStops.length < 2
            ? (extraStops[0] || {}).value
            : extraStops
                .map(
                    (s, i) =>
                        `${
                            extraStops[i] ? '<br>' : ''
                        }<strong style="margin-left:12px; color: #D32F2F">${this.ordinalSuffixOf(
                            i + 1
                        )} Stop: </strong>${s.value}`
                )
                .join('');
    }),
    (Reservations.ordinalSuffixOf = function (i) {
        var j = i % 10,
            k = i % 100;
        if (j == 1 && k != 11) {
            return i + 'st';
        }
        if (j == 2 && k != 12) {
            return i + 'nd';
        }
        if (j == 3 && k != 13) {
            return i + 'rd';
        }
        return i + 'th';
    }),
    (Reservations.getTotalAmount = function ({
        extraMilesAmount,
        extraStopsAmount,
        eStops = [],
        surges = [],
        meetAndGreet = [],
        isMeetAndGreet,
        gratuity,
        customGratuity,
        discounts = [],
        miles,
        cars = [],
    } = {}) {
        let sumOfTotalCars = 0,
            discountedAmount = 0,
            discountedPercentage = 0;
        let discountedPrice = 0;

        cars.forEach((car) => {
            sumOfTotalCars =
          Reservations.carTotalAmount(car, miles, extraMilesAmount) +
          sumOfTotalCars;
        });

        discounts.forEach((obj) => {
            if (+obj.amount) {
                discountedAmount = discountedAmount + +obj.amount;
            } else {
                discountedPercentage = discountedPercentage + +obj.percentage;
            }
        });

        discountedPrice = sumOfTotalCars - discountedAmount;

        discountedPrice =
        discountedPrice - discountedPrice * (discountedPercentage / 100);

        const totalAmountSavedAfterDiscountedPrice = discountedPrice;

        let totalGratuity = 0;
        if (customGratuity) {
            discountedPrice = discountedPrice + +customGratuity;
        } else {
            totalGratuity = totalAmountSavedAfterDiscountedPrice * (gratuity / 100);
        }

        let totalBill = discountedPrice + totalGratuity;
        
        if (isMeetAndGreet) {
            if (meetAndGreet.amount) totalBill = totalBill + +meetAndGreet.amount;
            else
                totalBill = totalBill + (totalAmountSavedAfterDiscountedPrice * (+meetAndGreet.percentage / 100));
        }

        if (surges) {
            let surgeAmount = 0,
                surgePercentage = 0;
            surges.forEach((surge) => {
                if (+surge.amount) {
                    surgeAmount = surgeAmount + +surge.amount;
                } else {
                    surgePercentage = surgePercentage + +surge.percentage;
                }
            });
            totalBill = totalBill + surgeAmount;
            totalBill = totalBill + (totalAmountSavedAfterDiscountedPrice * (surgePercentage / 100));
        }

        // totalBill = totalBill + +extraMilesAmount;

        let noOfExtraStop = eStops.length;
        totalBill = totalBill + +extraStopsAmount * noOfExtraStop;

        return totalBill;
    });

    Reservations.calculateDriversAmount = function (
        cars = [],
        miles,
        bill,
        extraMilesAmount
    ) {
        const tempCars = JSON.parse(JSON.stringify(cars));

        let totalBillOfCars = 0;
        let requiredCars = 0;
        tempCars.forEach((car) => {
            car.price = Reservations.carTotalAmount(car, miles, extraMilesAmount);
            totalBillOfCars += car.price;
            car.price = car.price / car.requiredCars;
            requiredCars += car.requiredCars;
        });

        const subTotal = bill - totalBillOfCars;
        const amount = subTotal / requiredCars;

        tempCars.forEach((car) => {
            car.price = car.price + amount;
        });

        return tempCars;
    };

    Reservations.carTotalAmount = function (car, miles, extraMilesAmount) {
        const amount = miles * car.toMultiply + car.toAdd;
        let value =
      amount > car.minimumRate
          ? amount * car.requiredCars
          : car.minimumRate * car.requiredCars;
        value = value + +extraMilesAmount;
        return +Number(value).toFixed(2);
    };

    Reservations.prototype.addDetails = async function ({
        discounts,
        surges,
        extraStops,
        cars,
    }) {
        const appliedDiscounts = await this.addDiscounts(discounts);
        const appliedSurges = await this.addSurges(surges);
        const eStops = await this.addExtraStops(extraStops);
        const bookedCars = await this.addCars(cars);

        return {
            surges: appliedSurges,
            discounts: appliedDiscounts,
            extraStops: eStops,
            cars: bookedCars,
        };
    };

    Reservations.prototype.addCars = async function (cars) {
        let carReservations = [];
        cars.forEach((car) => {
            Array(car.requiredCars)
                .fill()
                .forEach(() => {
                    carReservations.push({
                        reservationId: this.id,
                        carId: car.id,
                        price: car.price,
                        name: car.name,
                        awsObjectKey: car.awsObjectKey,
                        imageUrl: car.imageUrl,
                        isActive: car.isActive,
                        isSelected: car.isSelected,
                        maxBags: car.maxBags,
                        maxPassenger: car.maxPassenger,
                        minimumRate: car.minimumRate,
                        quantity: car.quantity,
                        requiredCars: car.requiredCars,
                        toAdd: car.toAdd,
                        toMultiply: car.toMultiply,
                    });
                });
        });
        const reservationDetails = await _models.ReservationDetails.$$bulkCreate(
            carReservations
        );
        return reservationDetails;
    };
    Reservations.prototype.addSurges = async function (surges = []) {
        let appliedSurges = surges.map((surge) => {
            return {
                reservationId: this.id,
                percentage: surge.percentage,
                amount: surge.amount,
                name: surge.name,
                description: surge.description,
            };
        });

        let reservationSurges = [];
        if (appliedSurges.length) {
            reservationSurges = await _models.ReservationSurges.$$bulkCreate(
                appliedSurges
            );
        }
        return reservationSurges;
    };
    Reservations.prototype.addDiscounts = async function (discounts = []) {
        let appliedDiscounts = discounts.map((discountCode) => {
            return {
                reservationId: this.id,
                percentage: discountCode.percentage,
                amount: discountCode.amount,
                code: discountCode.code,
                type: discountCode.type,
            };
        });

        let reservationDiscounts = [];
        if (appliedDiscounts.length) {
            reservationDiscounts =
        await _models.ReservationDiscountCodes.$$bulkCreate(appliedDiscounts);
        }

        return reservationDiscounts;
    };
    Reservations.prototype.addExtraStops = async function (extraStops = []) {
        let eStops = extraStops.map((extraStop) => {
            return {
                reservationId: this.id,
                value: extraStop.value,
            };
        });

        let reservationExtraStops = [];
        if (eStops.length) {
            reservationExtraStops = await _models.ReservationExtraStops.$$bulkCreate(
                eStops
            );
        }

        return reservationExtraStops;
    };

    return Reservations;
};
