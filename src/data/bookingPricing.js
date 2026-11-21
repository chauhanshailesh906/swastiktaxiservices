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
  { id: 1, name: 'Dzire (4-seater)', capacity: 4 },
  { id: 2, name: 'Ertiga (6-seater)', capacity: 6 },
];

const dzireRouteFares = {
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
  'Joshimath|Rishikesh': { oneWay: 7500, roundTrip: 13000 },
};

const ertigaRouteFares = {
  'Auli|Badrinath': { oneWay: 5000, roundTrip: 7500 },
  'Auli|Dehradun': { oneWay: 10000, roundTrip: 15000 },
  'Auli|Govindghat': { oneWay: 4500, roundTrip: 5500 },
  'Auli|Haridwar': { oneWay: 10000, roundTrip: 15000 },
  'Auli|Joshimath': { oneWay: 3000, roundTrip: 4000 },
  'Auli|Rishikesh': { oneWay: 9000, roundTrip: 14000 },
  'Badrinath|Dehradun': { oneWay: 12000, roundTrip: 16000 },
  'Badrinath|Govindghat': { oneWay: 3000, roundTrip: 4000 },
  'Badrinath|Haridwar': { oneWay: 12000, roundTrip: 16000 },
  'Badrinath|Joshimath': { oneWay: 5000, roundTrip: 7000 },
  'Badrinath|Rishikesh': { oneWay: 12000, roundTrip: 17000 },
  'Dehradun|Govindghat': { oneWay: 11500, roundTrip: 15000 },
  'Dehradun|Haridwar': { oneWay: 5500, roundTrip: 7500 },
  'Dehradun|Joshimath': { oneWay: 10000, roundTrip: 15000 },
  'Dehradun|Rishikesh': { oneWay: 4500, roundTrip: 6000 },
  'Govindghat|Haridwar': { oneWay: 11000, roundTrip: 15000 },
  'Govindghat|Joshimath': { oneWay: 2000, roundTrip: 3000 },
  'Govindghat|Rishikesh': { oneWay: 10000, roundTrip: 15000 },
  'Haridwar|Joshimath': { oneWay: 10000, roundTrip: 15000 },
  'Haridwar|Rishikesh': { oneWay: 4500, roundTrip: 6000 },
  'Joshimath|Rishikesh': { oneWay: 8000, roundTrip: 14000 },
};

const routeFaresByVehicle = {
  1: dzireRouteFares,
  2: ertigaRouteFares,
};

export function getBookingFare(booking) {
  const routeKey = [booking.pickupLocation, booking.dropLocation].sort().join('|');
  const selectedVehicle = vehicles.find(
    (vehicle) => vehicle.id === Number(booking.vehicle)
  );

  if (!selectedVehicle) return null;

  const routeFare = routeFaresByVehicle[selectedVehicle.id]?.[routeKey];
  if (!routeFare) return null;

  return booking.tripType === 'Round Trip'
    ? routeFare.roundTrip
    : routeFare.oneWay;
}
