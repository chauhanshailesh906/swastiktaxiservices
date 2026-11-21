import test from 'node:test';
import assert from 'node:assert/strict';
import { getBookingFare } from './bookingPricing.js';

test('calculates the configured Haridwar-Auli fares for both vehicles', () => {
  const booking = {
    pickupLocation: 'Haridwar',
    dropLocation: 'Auli',
    tripType: 'One Way',
    vehicle: '1',
  };

  assert.equal(getBookingFare(booking), 9000);
  assert.equal(getBookingFare({ ...booking, vehicle: '2' }), 10000);
  assert.equal(
    getBookingFare({ ...booking, tripType: 'Round Trip', vehicle: '1' }),
    14000
  );
  assert.equal(
    getBookingFare({ ...booking, tripType: 'Round Trip', vehicle: '2' }),
    15000
  );
});

test('uses the same fare in reverse and rejects unknown routes', () => {
  assert.equal(
    getBookingFare({
      pickupLocation: 'Auli',
      dropLocation: 'Haridwar',
      tripType: 'One Way',
      vehicle: '1',
    }),
    9000
  );
  assert.equal(
    getBookingFare({
      pickupLocation: 'Haridwar',
      dropLocation: 'Haridwar',
      tripType: 'One Way',
      vehicle: '1',
    }),
    null
  );
});
