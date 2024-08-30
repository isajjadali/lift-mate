import moment from 'moment';
import CommonMixin from './common-mixin.js';
import { RESERVATION_STATUSES } from '@/enums';

export default {
  mixins: [CommonMixin],
  methods: {
    pickUpAllowedDates(val) {
      return val >= moment().format('yyyy-MM-DD');
    },
    getHoursDiffFromCurrentTime(date) {
      let currentTime = `${moment().format('YYYY-MM-DDTHH:mm:ss')}Z`;
      currentTime = moment(moment(currentTime), 'DD-MM-YYYY hh:mm:ss A');
      const newTime = moment(moment(date), 'DD-MM-YYYY hh:mm:ss A');
      return newTime.diff(currentTime, 'hours');
    },
    reservationCarCalculation(payload) {
      const reservationMiles = this.getNumericValue(payload.miles);
      const carMinimumRate = this.getNumericValue(payload.car.minimumRate);
      const carToMultiply = this.getNumericValue(payload.car.toMultiply);
      const carToAdd = this.getNumericValue(payload.car.toAdd);
      const extraMilesAmount = this.getNumericValue(payload.extraMilesAmount);
      const requiredCars = this.getNumericValue(payload.car.requiredCars);

      let amount = reservationMiles * carToMultiply + carToAdd;

      if (payload.isCreatePage && payload.roundTrip) {
        let childMilesAmount = payload.childMiles * carToMultiply + carToAdd;
        let parentMilesAmount = payload.parentMiles * carToMultiply + carToAdd;
        childMilesAmount =
          childMilesAmount > carMinimumRate
            ? childMilesAmount * requiredCars
            : carMinimumRate * requiredCars;

        parentMilesAmount =
          parentMilesAmount > carMinimumRate
            ? parentMilesAmount * requiredCars
            : carMinimumRate * requiredCars;
        amount = childMilesAmount + parentMilesAmount;
      } else {
        amount =
          amount > carMinimumRate
            ? amount * requiredCars
            : carMinimumRate * requiredCars;
      }

      amount = amount + extraMilesAmount;

      return +Number(amount).toFixed(2);
    },
    formattedExtraStops(extraStops) {
      return extraStops.length < 2
        ? (extraStops[0] || {}).value
        : extraStops
            .map(
              (s, i) =>
                `${
                  extraStops[i] ? '<br>' : ''
                }<strong class="ml-3 text-info">${this.ordinalSuffixOf(
                  i + 1
                )} Stop: </strong>${s.value}`
            )
            .join('');
    },
  },
};
