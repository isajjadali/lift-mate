export const calculateAndSetDistanceInMilesOnPayload = async (
  reservationPayload
) => {
  try {
    const step1 = reservationPayload.step1;

    const locations = [
      { value: step1.pickupLocation },
      ...step1.extraStops,
      { value: step1.dropOffLocation },
    ];

    let miles = await getAndCalculateMiles(locations);
    miles = +Number(miles).toFixed(2);
    step1.parentMiles = miles;

    if (step1.isRoundTrip) {
      let roundTripLocations = [
        { value: step1.dropOffLocation },
        ...step1.returnExtraStops,
        { value: step1.pickupLocation },
      ];

      let returnMiles = await getAndCalculateMiles(
        roundTripLocations
      );
      returnMiles = +Number(returnMiles).toFixed(2);
      step1.childMiles = returnMiles;
      miles += returnMiles;
    }

    step1.miles = +Number(miles).toFixed(2);
    const response = await getMilesFromGoogle(
      step1.pickupLocation,
      step1.dropOffLocation
    );

    const distance = response?.rows[0]?.elements[0]?.distance?.text;
    miles = distance?.split(' ')[0];
    step1.miles = +miles.replaceAll(',', '');
  } catch (error) {
    console.error(error, '<<== error in calculateAndSetDistanceInMilesOnPayload');
  }
};

const getAndCalculateMiles = async (locations) => {
  let results = await Promise.all(
    locations.map((loc, index) => {
      if (locations[index + 1]) {
        return getMilesFromGoogle(
          loc.value,
          locations[index + 1].value
        );
      }
    })
  );

  return results
    .filter((r) => r)
    .map((r) => r?.rows[0]?.elements[0]?.distance?.text || 0)
    .filter((r) => {
      return r.includes ? r.includes('mi') : false;
    })
    .map((r) => +r?.split(' ')[0].replaceAll(',', ''))
    .reduce((accu, r) => {
      accu += r;
      return accu;
    }, 0);
};

const getMilesFromGoogle = (origin, destination) => {
  const googleApiService =
    new window.google.maps.DistanceMatrixService();
  return new Promise((resolve) => {
    googleApiService.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: 'DRIVING',
        unitSystem: google.maps.UnitSystem.IMPERIAL,
        // avoidHighways: false,
        // avoidTolls: false
      },
      function (response) {
        resolve(response);
      }
    );
  });
};
