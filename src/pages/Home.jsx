import { Link } from 'react-router-dom';

function Home() {
  const isAuthenticated = localStorage.getItem('token') !== null;
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };
  const popularRoutes = [
    { from: 'Haridwar', to: 'Badrinath', time: '7–8 hrs', note: 'Pilgrimage route for comfortable hill travel' },
    { from: 'Haridwar', to: 'Govindghat', time: '8–9 hrs', note: 'Ideal for Char Dham and valley travel' },
    { from: 'Haridwar', to: 'Auli', time: '9–10 hrs', note: 'Snowy Himalayan destination route' },
    { from: 'Haridwar', to: 'Joshimath', time: '8–9 hrs', note: 'Popular route for family and tourist trips' }
  ];

  const fleet = [
    { name: 'Dzire', seats: '4 Seats', details: 'Perfect for solo and couple travel', image: '/dzire.png' },
    { name: 'Ertiga', seats: '6 Seats', details: 'Comfortable for family and group travel', image: '/ertiga.png' }
  ];

  const reasons = [
    { title: 'Safe & Reliable', text: 'Trusted cab service for every journey with responsible driving and care.' },
    { title: '24/7 Pickup & Drop', text: 'On-time service for early morning and late-night travel needs.' },
    { title: 'Experienced Drivers', text: 'Skilled drivers familiar with mountain roads and local routes.' },
    { title: 'Well-Maintained Vehicles', text: 'Clean, comfortable, and regularly checked cars for every trip.' }
  ];

  const destinations = [
    { title: 'Haridwar', subtitle: 'Spiritual city and gateway to the Himalayas', image: '/haridwar.png' },
    { title: 'Badrinath', subtitle: 'Sacred shrine and godly pilgrimage stop', image: '/badrinath.png' },
    { title: 'Govindghat', subtitle: 'Base point for Himalayan journeys', image: '/govindghat.png' },
    { title: 'Auli', subtitle: 'Panoramic snow-clad hill destination', image: '/auli.png' },
    { title: 'Joshimath', subtitle: 'A scenic mountain town with spiritual charm', image: '/joshimath.png' }
  ];

  const reviews = [
    { name: 'Ritika Sharma', text: 'Very polite driver and the vehicle was spotless. Our trip to Badrinath felt comfortable and safe.' },
    { name: 'Manoj Verma', text: 'We booked for Joshimath and the service was on time. Definitely recommend for all Himalayan trips.' },
    { name: 'Sandeep Rawat', text: 'Excellent taxi service with smooth pickup and professional behavior. Highly recommended.' }
  ];

  const faqs = [
    { question: 'Do you provide one-way and round-trip taxi services?', answer: 'Yes, we offer both one-way and round-trip bookings for popular routes and local travel.' },
    { question: 'Are your drivers experienced for hill routes?', answer: 'Yes, our drivers are experienced and familiar with Himalayan roads and mountain travel conditions.' },
    { question: 'Can I book for family or group travel?', answer: 'Yes, we provide comfortable options like Ertiga for family and group journeys.' },
    { question: 'Do you support WhatsApp bookings?', answer: 'Yes, you can contact us directly on WhatsApp for quick booking assistance.' }
  ];

  return (
    <div className="home-page">
      <header className="topbar container">
        <div className="brand-header">
          <img src="/logo.png" alt="Swastik Taxi Services" className="brand-logo" />
        </div>

        <nav className="main-nav">
          <a href="#home">Home</a>
          <a href="#routes">Routes</a>
          <a href="#fleet">Fleet</a>
          <a href="#about">Why Us</a>
          <a href="#reviews">Reviews</a>
          <a href="#faq">FAQ</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main>
        <section className="hero container" id="home">
          <div className="hero-copy">
            <span className="eyebrow">Safe Ride • Comfortable Journey • Always With You</span>
            <h1>
              SWASTIK <span>TAXI SERVICES</span>
            </h1>
            <p>
              Your Travel Partner in Uttarakhand. Trusted taxi service for Haridwar, Badrinath, Govindghat, Auli, Joshimath and all local and outstation trips.
            </p>

            <div className="hero-actions">
              {/* <Link to="/booking" className="cta-btn primary">Book Taxi</Link> */}
              <a className="cta-btn secondary" href="tel:+919456103026">Call Now</a>
              <a className="cta-btn whatsapp" href="https://wa.me/919456103026" target="_blank" rel="noreferrer">WhatsApp</a>
            </div>

            <div className="hero-stats">
              <div>
                <strong>24/7</strong>
                <span>Pickup & Drop</span>
              </div>
              <div>
                <strong>Local</strong>
                <span>Tour experts</span>
              </div>
              <div>
                <strong>Trusted</strong>
                <span>Family service</span>
              </div>
            </div>
          </div>

          <div className="hero-panel">
            <div className="trip-badge">Popular route</div>
            <h3>Haridwar → Badrinath</h3>
            <div className="route-box">
              <div>
                <span>Departure</span>
                <strong>Haridwar</strong>
              </div>
              <div className="arrow">→</div>
              <div>
                <span>Destination</span>
                <strong>Badrinath</strong>
              </div>
            </div>
            <ul>
              <li>Comfortable hill drive</li>
              <li>Safe and reliable service</li>
              <li>Transparent and fair pricing</li>
            </ul>
          </div>
        </section>

        <section className="popular container" id="routes">
          <div className="section-heading">
            <span>Our Services</span>
            <h2>Travel with comfort and confidence</h2>
          </div>

          <div className="route-grid">
            {popularRoutes.map((route) => (
              <div className="route-card" key={`${route.from}-${route.to}`}>
                <div className="route-city">
                  <span>{route.from}</span>
                  <span className="route-arrow">→</span>
                  <span>{route.to}</span>
                </div>
                <strong>{route.time}</strong>
                <p>{route.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="fleet container" id="fleet">
          <div className="section-heading">
            <span>Our fleet</span>
            <h2>Comfortable vehicles for every trip</h2>
          </div>

          <div className="fleet-grid">
            {fleet.map((car) => (
              <div className="fleet-card" key={car.name}>
                <img src={car.image} alt={car.name} className="car-icon" />
                <h3>{car.name}</h3>
                <p className="seats">{car.seats}</p>
                <p>{car.details}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="why-us container" id="about">
          <div className="section-heading">
            <span>Why choose us</span>
            <h2>Built for safe, dependable travel</h2>
          </div>

          <div className="feature-grid">
            {reasons.map((item) => (
              <div className="feature-card" key={item.title}>
                <div className="feature-icon">✓</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="destination-section container">
          <div className="section-heading">
            <span>Top destinations</span>
            <h2>Explore the beauty of Uttarakhand</h2>
          </div>

          <div className="destination-grid">
            {destinations.map((place) => (
              <div className="destination-card" key={place.title}>
                <div className="destination-image">
                  <img src={place.image} alt={place.title} className="destination-icon" />
                </div>
                <div className="destination-text">
                  <h3>{place.title}</h3>
                  <p>{place.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="reviews container" id="reviews">
          <div className="section-heading">
            <span>Customer reviews</span>
            <h2>What our travelers say</h2>
          </div>

          <div className="review-grid">
            {reviews.map((review) => (
              <div className="review-card" key={review.name}>
                <div className="stars">★★★★★</div>
                <p>“{review.text}”</p>
                <strong>{review.name}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="faq container" id="faq">
          <div className="section-heading">
            <span>FAQ</span>
            <h2>Frequently asked questions</h2>
          </div>

          <div className="faq-list">
            {faqs.map((faq) => (
              <div className="faq-item" key={faq.question}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="contact container" id="contact">
          <div className="contact-box">
            <div>
              <span>Need a cab now?</span>
              <h2>Book your ride with Swastik Taxi Services</h2>
            </div>

            <div className="contact-actions">
              <a className="cta-btn primary" href="tel:+919456103026">Call Now</a>
              <a className="cta-btn whatsapp" href="https://wa.me/919456103026" target="_blank" rel="noreferrer">WhatsApp</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div>
            <div className="logo-title footer-brand">SWASTIK</div>
            <p>Safe and comfortable taxi journeys across Uttarakhand.</p>
          </div>

          <div>
            <h4>Quick links</h4>
            <ul>
              <li><a href="#routes">Popular Routes</a></li>
              <li><a href="#fleet">Fleet</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4>Contact</h4>
            <ul>
              <li>+91 94561 03026</li>
              <li>chauhanshailesh906@gmail.com</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
