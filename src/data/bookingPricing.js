export const popularLocations = [
  'Haridwar',
  'Badrinath',
  'Govindghat',
  'Auli',
  'Joshimath',
  'Rishikesh',
  'Dehradun',
];

export const pickupLocations = [
  'Badrinath',
  'Govindghat',
  'Auli',
  'Joshimath',
];

export const vehicles = [
  { id: 1, name: 'Dzire (4-seater)', capacity: 4, fareAdjustment: 0 },
  { id: 2, name: 'Ertiga (6-seater)', capacity: 6, fareAdjustment: 2000 },
];

const routeFares = {
  'Auli|Badrinath': { oneWay: 3000, roundTrip: 5500 },
  'Auli|Dehradun': { oneWay: 9000, roundTrip: 14000 },
  'Auli|Govindghat': { oneWay: 3500, roundTrip: 4500 },
  'Auli|Haridwar': { oneWay: 9000, roundTrip: 14000 },
  'Auli|Joshimath': { oneWay: 2000, roundTrip: 3000 },
  'Auli|Rishikesh': { oneWay: 7500, roundTrip: 12000 },
  'Badrinath|Dehradun': { oneWay: 11000, roundTrip: 15000 },
  'Badrinath|Govindghat': { oneWay: 2000, roundTrip: 3000 },
  'Badrinath|Haridwar': { oneWay: 10000, roundTrip: 15000 },
  'Badrinath|Joshimath': { oneWay: 3000, roundTrip: 5000 },
  'Badrinath|Rishikesh': { oneWay: 10000, roundTrip: 15000 },
  'Dehradun|Govindghat': { oneWay: 9500, roundTrip: 14000 },
  'Dehradun|Haridwar': { oneWay: 3500, roundTrip: 5500 },
  'Dehradun|Joshimath': { oneWay: 8000, roundTrip: 14000 },
  'Dehradun|Rishikesh': { oneWay: 2500, roundTrip: 4000 },
  'Govindghat|Haridwar': { oneWay: 9000, roundTrip: 14000 },
  'Govindghat|Joshimath': { oneWay: 2500, roundTrip: 4000 },
  'Govindghat|Rishikesh': { oneWay: 8500, roundTrip: 13000 },
  'Haridwar|Joshimath': { oneWay: 9000, roundTrip: 14000 },
  'Haridwar|Rishikesh': { oneWay: 2500, roundTrip: 4000 },
  'Joshimath|Rishikesh': { oneWay: 8000, roundTrip: 13000 },
};

export function getBookingFare(booking) {
  const routeKey = [booking.pickupLocation, booking.dropLocation].sort().join('|');
  const routeFare = routeFares[routeKey];
  const selectedVehicle = vehicles.find(
    (vehicle) => vehicle.id === Number(booking.vehicle)
  );

  if (!routeFare || !selectedVehicle) return null;

  const baseFare =
    booking.tripType === 'Round Trip' ? routeFare.roundTrip : routeFare.oneWay;

  return baseFare + selectedVehicle.fareAdjustment;
}
