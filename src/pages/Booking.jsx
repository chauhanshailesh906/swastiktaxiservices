import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import SEO from '../SEO';
import '../styles/Booking.css';
import {
  getBookingFare,
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
    email: '',
    specialInstructions: '',
  });

  const [fareEstimate, setFareEstimate] = useState(null);
  const selectedVehicle = vehicles.find(
    (vehicle) => vehicle.id === Number(bookingData.vehicle)
  );
  const upiQuery = new URLSearchParams({
    pa: UPI_ID,
    pn: 'Swastik Taxi Services',
    am: String(fareEstimate ?? ''),
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
  ].join('\n');
  const whatsappBookingUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

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
                {popularLocations.map((loc) => (
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

            <div className="form-group">
              <label>Email (Optional)</label>
              <input
                type="email"
                name="email"
                value={bookingData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Special Instructions (Optional)</label>
              <textarea
                name="specialInstructions"
                value={bookingData.specialInstructions}
                onChange={handleInputChange}
                placeholder="Any special requests or instructions..."
                className="form-input"
                rows="4"
              ></textarea>
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
                <h3>Estimated Fare</h3>
                <div className="fare-breakdown">
                  <div className="fare-item">
                    <span>
                      {bookingData.pickupLocation} to {bookingData.dropLocation} ({bookingData.tripType}):
                    </span>
                    <span>₹{fareEstimate.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="fare-item total">
                    <span>Total Estimated Fare:</span>
                    <span className="fare-amount">
                      ₹{fareEstimate.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
                <p className="fare-note">
                  * These are sample fares and must be confirmed before booking.
                </p>
              </div>
            )}

            <p className="fare-note">
              After paying, return here and send your booking details on WhatsApp.
              Payment must be verified manually before the booking is confirmed.
            </p>
            <div className="upi-payment">
              <p>On a desktop, scan this QR code with any UPI app:</p>
              <QRCodeSVG
                className="upi-qr"
                value={upiPaymentUrl}
                size={200}
                level="M"
                title="UPI payment QR code"
              />
              <p className="upi-id">
                UPI ID: <strong>{UPI_ID}</strong>
              </p>
              <p className="fare-note">
                On a phone, use the Pay via UPI button below.
              </p>
            </div>
            <a
              className="btn btn-success"
              href={whatsappBookingUrl}
              target="_blank"
              rel="noreferrer"
            >
              I have paid — send payment details on WhatsApp
            </a>
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

          {currentStep === 6 && (
            <a
              className="btn btn-success"
              href={upiPaymentUrl}
            >
              Pay via UPI
            </a>
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
