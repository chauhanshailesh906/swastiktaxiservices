import React, { useState } from 'react';
import '../styles/Booking.css';

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

  const vehicles = [
    { id: 1, name: 'Dzire (4-seater)', price: 30, capacity: 4 },
    { id: 2, name: 'Ertiga (6-seater)', price: 40, capacity: 6 },
  ];

  const popularLocations = [
    'Haridwar',
    'Badrinath',
    'Govindghat',
    'Auli',
    'Joshimath',
    'Rishikesh',
    'Mussorie',
    'Dehradun',
  ];

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
        return true;
      case 2:
        if (!bookingData.travelDate || !bookingData.pickupTime) {
          alert('Please select travel date and time');
          return false;
        }
        return true;
      case 3:
        if (!bookingData.vehicle) {
          alert('Please select a vehicle');
          return false;
        }
        return true;
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
    const selectedVehicle = vehicles.find((v) => v.id === parseInt(bookingData.vehicle));
    if (!selectedVehicle) return 0;

    const basePrice = selectedVehicle.price;
    const estimatedDistance = 0; // Default 50 km for fare calculation
    const baseFare = basePrice * estimatedDistance;
    const tripMultiplier = bookingData.tripType === 'Round Trip' ? 2 : 1;

    return baseFare * tripMultiplier;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 5) {
        // Calculate fare on step 5
        setFareEstimate(calculateFare());
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

  const handleConfirmBooking = () => {
    alert('Booking confirmed! Confirmation details have been sent to your mobile number.');
    // Here you would send the booking data to your backend
    console.log('Booking Data:', bookingData, 'Fare:', fareEstimate);
  };

  return (
    <div className="booking-container">
      <div className="booking-card">
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
                max="6"
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
                    <p className="price">₹{vehicle.price}/km</p>
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
                    <span>Base Fare (approx. 50 km):</span>
                    <span>₹{(fareEstimate / (bookingData.tripType === 'Round Trip' ? 2 : 1)).toFixed(2)}</span>
                  </div>
                  {bookingData.tripType === 'Round Trip' && (
                    <div className="fare-item">
                      <span>Trip Multiplier (2x for Round Trip):</span>
                      <span>2x</span>
                    </div>
                  )}
                  <div className="fare-item total">
                    <span>Total Estimated Fare:</span>
                    <span className="fare-amount">₹{fareEstimate.toFixed(2)}</span>
                  </div>
                </div>
                <p className="fare-note">
                  * This is an estimated fare based on distance. Final fare may vary based on actual distance traveled.
                </p>
              </div>
            )}

            <div className="terms-check">
              <input type="checkbox" id="terms" />
              <label htmlFor="terms">
                I agree to the terms and conditions and privacy policy
              </label>
            </div>
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
            <button className="btn btn-success" onClick={handleConfirmBooking}>
              Confirm Booking
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
