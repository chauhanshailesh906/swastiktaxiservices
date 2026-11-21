import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import SEO from '../SEO';
import '../styles/Booking.css';
import {
  getBookingFare,
  pickupLocations,
  popularLocations,
  vehicles,
} from '../data/bookingPricing.js';

const UPI_ID = '9456103026@superyes';
const WHATSAPP_NUMBER = '919456103026';

const Booking = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    pickupLocation: '',
    dropLocation: '',
    travelDate: '',
    pickupTime: '',
    passengers: 1,
    vehicle: '',
    tripType: 'One Way',
    customerName: '',
    mobileNumber: '',
    userOffer: '',
  });

  const [fareEstimate, setFareEstimate] = useState(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [fareChoice, setFareChoice] = useState('');
  const selectedVehicle = vehicles.find(
    (vehicle) => vehicle.id === Number(bookingData.vehicle)
  );
  const userOfferAmount = Number(bookingData.userOffer);
  const paymentAmount = fareEstimate;
  const upiQuery = new URLSearchParams({
    pa: UPI_ID,
    pn: 'Swastik Taxi Services',
    am: String(paymentAmount ?? ''),
    cu: 'INR',
    tn: 'Taxi booking',
  }).toString().replace(/\+/g, '%20');
  const upiPaymentUrl = `upi://pay?${upiQuery}`;
  const whatsappMessage = [
    'I have completed payment through UPI. Please verify it and confirm my booking.',
    `Name: ${bookingData.customerName}`,
    `Mobile: ${bookingData.mobileNumber}`,
    `Trip: ${bookingData.pickupLocation} to ${bookingData.dropLocation} (${bookingData.tripType})`,
    `Date and time: ${bookingData.travelDate} at ${bookingData.pickupTime}`,
    `Vehicle: ${selectedVehicle?.name || 'Not selected'}`,
    `Passengers: ${bookingData.passengers}`,
    `Estimated fare: INR ${fareEstimate?.toLocaleString('en-IN') || 'Not available'}`,
    `Accepted fare: INR ${paymentAmount?.toLocaleString('en-IN') || 'Not available'}`,
  ].join('\n');
  const whatsappBookingUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
  const counterOfferMessage = [
    'I would like to make a counter offer for my taxi booking.',
    `Name: ${bookingData.customerName}`,
    `Mobile: ${bookingData.mobileNumber}`,
    `Trip: ${bookingData.pickupLocation} to ${bookingData.dropLocation} (${bookingData.tripType})`,
    `Date and time: ${bookingData.travelDate} at ${bookingData.pickupTime}`,
    `Vehicle: ${selectedVehicle?.name || 'Not selected'}`,
    `Estimated fare: INR ${fareEstimate?.toLocaleString('en-IN') || 'Not available'}`,
    `My offer: INR ${bookingData.userOffer || 'Not provided'}`,
  ].join('\n');
  const counterOfferUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(counterOfferMessage)}`;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData({
      ...bookingData,
      [name]: value,
    });
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!bookingData.pickupLocation || !bookingData.dropLocation) {
          alert('Please select both pickup and drop locations');
          return false;
        }
        if (bookingData.pickupLocation === bookingData.dropLocation) {
          alert('Pickup and drop locations must be different');
          return false;
        }
        return true;
      case 2:
        if (!bookingData.travelDate || !bookingData.pickupTime) {
          alert('Please select travel date and time');
          return false;
        }
        return true;
      case 3: {
        if (!bookingData.vehicle) {
          alert('Please select a vehicle');
          return false;
        }
        const selectedVehicle = vehicles.find(
          (vehicle) => vehicle.id === Number(bookingData.vehicle)
        );
        if (!selectedVehicle) {
          alert('Please select a valid vehicle');
          return false;
        }
        const passengerCount = Number(bookingData.passengers);
        if (
          !Number.isInteger(passengerCount) ||
          passengerCount < 1 ||
          passengerCount > selectedVehicle.capacity
        ) {
          alert(
            `${selectedVehicle.name} can carry between 1 and ${selectedVehicle.capacity} passengers. Please adjust the passenger count.`
          );
          return false;
        }
        return true;
      }
      case 4:
        if (!bookingData.customerName || !bookingData.mobileNumber) {
          alert('Please enter your name and mobile number');
          return false;
        }
        if (!/^\d{10}$/.test(bookingData.mobileNumber)) {
          alert('Please enter a valid 10-digit mobile number');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const calculateFare = () => {
    return getBookingFare(bookingData);
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 5) {
        const fare = calculateFare();
        if (fare === null) {
          alert('Fare is not available for this route');
          return;
        }
        setFareEstimate(fare);
      }
      if (currentStep < 6) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="booking-container">
      <SEO
        title="Book a Taxi | Swastik Taxi Services"
        description="Request a one-way or round-trip taxi with Swastik Taxi Services for Uttarakhand travel."
        noindex
      />
      <div className="booking-card">
        <Link
          to="/"
          className="booking-close"
          aria-label="Close booking and return home"
          title="Return to home"
        >
          &times;
        </Link>
        <Link to="/" className="btn btn-secondary booking-home-link">
          &larr; Home
        </Link>
        <h1 className="booking-title">Book Your Taxi</h1>

        {/* Progress Indicator */}
        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(currentStep / 6) * 100}%` }}
            ></div>
          </div>
          <div className="step-indicators">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div
                key={step}
                className={`step-indicator ${currentStep >= step ? 'active' : ''} ${
                  currentStep === step ? 'current' : ''
                }`}
              >
                <span>{step}</span>
              </div>
            ))}
          </div>
          <p className="step-label">
            Step {currentStep} of 6: {getStepLabel(currentStep)}
          </p>
        </div>

        {/* Step 1: Location Selection */}
        {currentStep === 1 && (
          <div className="step-content">
            <h2>Select Your Journey</h2>
            <div className="form-group">
              <label>Pickup Location *</label>
              <select
                name="pickupLocation"
                value={bookingData.pickupLocation}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="">Choose pickup location</option>
                {pickupLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Drop Location *</label>
              <select
                name="dropLocation"
                value={bookingData.dropLocation}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="">Choose drop location</option>
                {popularLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div className="trip-type-toggle">
              <label>Trip Type *</label>
              <div className="toggle-group">
                <button
                  className={`toggle-btn ${bookingData.tripType === 'One Way' ? 'active' : ''}`}
                  onClick={() =>
                    setBookingData({ ...bookingData, tripType: 'One Way' })
                  }
                >
                  One Way
                </button>
                <button
                  className={`toggle-btn ${bookingData.tripType === 'Round Trip' ? 'active' : ''}`}
                  onClick={() =>
                    setBookingData({ ...bookingData, tripType: 'Round Trip' })
                  }
                >
                  Round Trip
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Date & Time */}
        {currentStep === 2 && (
          <div className="step-content">
            <h2>Select Travel Date & Time</h2>
            <div className="form-group">
              <label>Travel Date *</label>
              <input
                type="date"
                name="travelDate"
                value={bookingData.travelDate}
                onChange={handleInputChange}
                className="form-input"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-group">
              <label>Pickup Time *</label>
              <input
                type="time"
                name="pickupTime"
                value={bookingData.pickupTime}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>
        )}

        {/* Step 3: Passengers & Vehicle */}
        {currentStep === 3 && (
          <div className="step-content">
            <h2>Passengers & Vehicle Selection</h2>
            <div className="form-group">
              <label>Number of Passengers *</label>
              <input
                type="number"
                name="passengers"
                value={bookingData.passengers}
                onChange={handleInputChange}
                min="1"
                max={
                  vehicles.find((vehicle) => vehicle.id === Number(bookingData.vehicle))
                    ?.capacity || 6
                }
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Select Vehicle *</label>
              <div className="vehicle-options">
                {vehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className={`vehicle-card ${
                      bookingData.vehicle === vehicle.id.toString() ? 'selected' : ''
                    }`}
                    onClick={() =>
                      setBookingData({ ...bookingData, vehicle: vehicle.id.toString() })
                    }
                  >
                    <h3>{vehicle.name}</h3>
                    <p>Capacity: {vehicle.capacity} Passengers</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Vehicle Type & Trip Type */}
        {currentStep === 4 && (
          <div className="step-content">
            <h2>Customer Details</h2>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="customerName"
                value={bookingData.customerName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Mobile Number *</label>
              <input
                type="tel"
                name="mobileNumber"
                value={bookingData.mobileNumber}
                onChange={handleInputChange}
                placeholder="Enter 10-digit mobile number"
                className="form-input"
              />
            </div>
          </div>
        )}

        {/* Step 5: Fare Estimate */}
        {currentStep === 5 && (
          <div className="step-content">
            <h2>Booking Summary</h2>
            <div className="booking-summary">
              <div className="summary-item">
                <span className="label">Pickup Location:</span>
                <span className="value">{bookingData.pickupLocation}</span>
              </div>
              <div className="summary-item">
                <span className="label">Drop Location:</span>
                <span className="value">{bookingData.dropLocation}</span>
              </div>
              <div className="summary-item">
                <span className="label">Travel Date:</span>
                <span className="value">{bookingData.travelDate}</span>
              </div>
              <div className="summary-item">
                <span className="label">Pickup Time:</span>
                <span className="value">{bookingData.pickupTime}</span>
              </div>
              <div className="summary-item">
                <span className="label">Passengers:</span>
                <span className="value">{bookingData.passengers}</span>
              </div>
              <div className="summary-item">
                <span className="label">Vehicle:</span>
                <span className="value">
                  {vehicles.find((v) => v.id === parseInt(bookingData.vehicle))?.name}
                </span>
              </div>
              <div className="summary-item">
                <span className="label">Trip Type:</span>
                <span className="value">{bookingData.tripType}</span>
              </div>
              <div className="summary-item">
                <span className="label">Passenger Name:</span>
                <span className="value">{bookingData.customerName}</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Fare Estimate & Confirmation */}
        {currentStep === 6 && (
          <div className="step-content">
            <h2>Fare Estimate & Confirmation</h2>
            {fareEstimate !== null && (
              <div className="fare-card">
                <div className="fare-card-heading">
                  <h3>Estimated Fare</h3>
                  <span className="fare-status">For review</span>
                </div>
                <div className="fare-breakdown">
                  <p className="fare-route">
                    {bookingData.pickupLocation} to {bookingData.dropLocation}
                  </p>
                  <div className="fare-comparison">
                    <div>
                      <span>Our Fare</span>
                      <strong>₹{fareEstimate.toLocaleString('en-IN')}</strong>
                    </div>
                    <div>
                      <span>Your Offer</span>
                      <strong className="user-offer-value">
                        {bookingData.userOffer
                          ? `₹${userOfferAmount.toLocaleString('en-IN')}`
                          : 'Not entered'}
                      </strong>
                    </div>
                  </div>
                  <div className="fare-offer">
                    <label htmlFor="userOffer">Your Offer (Optional)</label>
                    <div className="fare-offer-input">
                      <span>₹</span>
                      <input
                        id="userOffer"
                        type="number"
                        name="userOffer"
                        min="1"
                        step="1"
                        value={bookingData.userOffer}
                        onChange={handleInputChange}
                        placeholder="Enter your offer"
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>
                <p className="fare-note">
                  Accept our fare to continue, or send your offer for confirmation.
                </p>
                <div className="fare-actions">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setFareChoice('accepted')}
                  >
                    Accept ₹{fareEstimate.toLocaleString('en-IN')}
                  </button>
                  <a
                    className={`btn btn-secondary fare-counter-btn ${userOfferAmount > 0 ? '' : 'btn-disabled'}`}
                    href={counterOfferUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-disabled={userOfferAmount <= 0}
                    onClick={(event) => {
                      if (userOfferAmount <= 0) {
                        event.preventDefault();
                        alert('Please enter your offer before sending it.');
                      } else {
                        setFareChoice('counter');
                      }
                    }}
                  >
                    Send My Offer
                  </a>
                </div>
              </div>
            )}

            {fareChoice === 'counter' && (
              <div className="offer-status">
                <strong>Offer sent for review</strong>
                <p>Wait for confirmation on WhatsApp before making a payment.</p>
              </div>
            )}

            {fareChoice === 'accepted' && (
              <div className="payment-confirmation">
                <h3>Payment Confirmation</h3>
                <p className="payment-amount">
                  Confirmed amount: <strong>₹{paymentAmount?.toLocaleString('en-IN') || 'Not available'}</strong>
                </p>
                <div className="upi-payment">
                  <p>Scan with any UPI app</p>
                  <QRCodeSVG
                    className="upi-qr"
                    value={upiPaymentUrl}
                    size={180}
                    level="M"
                    title="UPI payment QR code"
                  />
                  <p className="upi-id">
                    UPI ID: <strong>{UPI_ID}</strong>
                  </p>
                  <a className="btn btn-primary mobile-pay-button" href={upiPaymentUrl}>
                    Pay via UPI
                  </a>
                </div>

                <div className="terms-check">
                  <input
                    id="paymentConfirmed"
                    type="checkbox"
                    checked={paymentConfirmed}
                    onChange={(e) => setPaymentConfirmed(e.target.checked)}
                  />
                  <label htmlFor="paymentConfirmed">
                    I confirm that I have completed the payment.
                  </label>
                </div>
                <a
                  className={`btn btn-success ${!paymentConfirmed ? 'btn-disabled' : ''}`}
                  href={whatsappBookingUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-disabled={!paymentConfirmed}
                  onClick={(event) => {
                    if (!paymentConfirmed) {
                      event.preventDefault();
                      alert('Please confirm that you have paid.');
                    }
                  }}
                >
                  Send Payment Details on WhatsApp
                </a>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="button-group">
          <button
            className="btn btn-secondary"
            onClick={handlePrev}
            disabled={currentStep === 1}
          >
            Previous
          </button>

          {currentStep < 5 && (
            <button className="btn btn-primary" onClick={handleNext}>
              Next
            </button>
          )}

          {currentStep === 5 && (
            <button className="btn btn-primary" onClick={handleNext}>
              View Fare Estimate
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

function getStepLabel(step) {
  const labels = [
    'Location',
    'Date & Time',
    'Vehicle Selection',
    'Personal Details',
    'Summary',
    'Confirmation',
  ];
  return labels[step - 1];
}

export default Booking;
