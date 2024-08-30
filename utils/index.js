export const ReservationCalculation = function ({
    extraMilesAmount,
    extraStopsAmount,
    eStops = [],
    surges = [],
    meetAndGreet = [],
    isMeetAndGreet,
    customGratuity,
    gratuity,
    discounts = [],
    miles,
    cars = [],
    checkingLocation,
    isRoundTrip,
    isCreatePage,
    addons = [],
} = {}) {
    let sumOfTotalCars = 0,
        discountedAmount = 0,
        discountedPercentage = 0;
    let discountedPrice = 0;
    const returnPayload = {};

    sumOfTotalCars = cars.reduce((acc, car) => {
        const amount = miles * car.toMultiply + car.toAdd;
        let value =
      amount > car.minimumRate
          ? amount * car.requiredCars
          : car.minimumRate * car.requiredCars;
        value = value + +extraMilesAmount;

        acc += +Number(value).toFixed(2);
        return acc;
    }, 0);

    returnPayload.sumOfTotalCars = +Number(sumOfTotalCars).toFixed(2);

    discounts.forEach((obj) => {
        if (+obj.amount) {
            discountedAmount =
        discountedAmount + (isRoundTrip ? +obj.amount / 2 : +obj.amount);
        } else {
            discountedPercentage = discountedPercentage + +obj.percentage;
        }
    });

    discountedPrice = sumOfTotalCars - discountedAmount;

    returnPayload.discountedAmount = discountedAmount;
    returnPayload.percentage = discountedPercentage;
    returnPayload.discountedPercentage =
    discountedPrice * (discountedPercentage / 100);

    discountedPrice =
    discountedPrice - discountedPrice * (discountedPercentage / 100);

    const totalAmountSavedAfterDiscountedPrice = discountedPrice;
    returnPayload.discountedPrice = +Number(discountedPrice).toFixed(2);

    // Converting string to number else 0 if NaN
    const numericValueOfCustomGratuity = getNumericValue(customGratuity);
    let numericValueOfGratuity = getNumericValue(gratuity);
    numericValueOfGratuity =
    numericValueOfGratuity === 1 ? 0 : numericValueOfGratuity;

    let totalGratuity = 0;
    if (numericValueOfCustomGratuity) {
        const gratuityToAdd = isRoundTrip
            ? numericValueOfCustomGratuity / 2
            : numericValueOfCustomGratuity;
        discountedPrice = discountedPrice + gratuityToAdd;
        returnPayload.gratuity = gratuityToAdd;
    } else if (numericValueOfGratuity) {
        totalGratuity =
      totalAmountSavedAfterDiscountedPrice * (numericValueOfGratuity / 100);
        returnPayload.gratuity = totalGratuity;
    }

    let totalBill = discountedPrice + totalGratuity;

    let isMeetAndGreetForTrip = isMeetAndGreet;
    if (isMeetAndGreetForTrip && isCreatePage) {
        isMeetAndGreetForTrip = ['fromAirport', 'pointToPoint'].includes(
            checkingLocation
        );
    }

    if (isMeetAndGreetForTrip) {
        if (meetAndGreet.amount) {
            totalBill += +meetAndGreet.amount;
            returnPayload.meetAndGreetAmount = +meetAndGreet.amount;
        } else {
            const meetAndGreetCalculated =
        totalAmountSavedAfterDiscountedPrice * (+meetAndGreet.percentage / 100);
            totalBill += meetAndGreetCalculated;
            returnPayload.meetAndGreetAmount = meetAndGreetCalculated;
        }
        returnPayload.meetAndGreetAssigned = true;
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
        totalBill +=
      surgeAmount +
      totalAmountSavedAfterDiscountedPrice * (surgePercentage / 100);
    }

    let noOfExtraStop = eStops.length;
    totalBill += getNumericValue(+extraStopsAmount) * noOfExtraStop;

    if (addons.length) {
        returnPayload.totalAddonAmount = 0;
        addons.forEach((addon) => {
            let addonAmount = +addon.amount;
            let addonPercentage = +addon.percentage;
            if (addonAmount) {
                totalBill += addonAmount;
                returnPayload.totalAddonAmount += addonAmount;
            } else if (addonPercentage) {
                const totalAddonPercentage = totalBill * (addonPercentage / 100);
                totalBill += totalAddonPercentage;
                returnPayload.totalAddonAmount += totalAddonPercentage;
            }
        });
    }

    returnPayload.tripBill = +Number(totalBill).toFixed(2);

    return returnPayload;
};

function getNumericValue(value) {
    const parsedValue = +value;
    return isNaN(parsedValue) ? 0 : parsedValue;
}