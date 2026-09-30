import { useEffect, useState } from 'react';

const API = 'http://localhost:5000/api';

const formatDate = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

export default function App() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [ticket, setTicket] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      setLoading(true);
      const res = await fetch(`${API}/events`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Unable to load events.');
      setEvents(data);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleBooking(e) {
    e.preventDefault();
    if (!selectedEvent) return;

    try {
      setBooking(true);
      setMessage('');

      const res = await fetch(`${API}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: selectedEvent._id,
          userName,
          userEmail
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || 'Booking failed.');
        return;
      }

      setTicket(data.ticket);
      setSelectedEvent(null);
      setUserName('');
      setUserEmail('');
      await fetchEvents();
    } catch {
      setMessage('Booking failed. Please check that the backend is running.');
    } finally {
      setBooking(false);
    }
  }

  return (
    <div className="app">
      <header className="hero">
        <nav>
          <div className="brand">Tech<span>Events</span></div>
          <a href="#events">Explore Events</a>
        </nav>

        <div className="hero-content">
          <p className="eyebrow">SMART EVENT & TICKET BOOKING</p>
          <h1>Discover your next<br /><span>tech experience.</span></h1>
          <p className="hero-copy">
            Find upcoming technology events, reserve your seat and receive
            your digital ticket instantly.
          </p>
          <a className="primary-btn" href="#events">Explore upcoming events ↓</a>
        </div>
      </header>

      <main id="events" className="content">
        <div className="section-heading">
          <div>
            <p className="eyebrow">WHAT'S COMING UP</p>
            <h2>Upcoming tech events</h2>
          </div>
          <span className="event-count">{events.length} events</span>
        </div>

        {message && <div className="alert">{message}</div>}

        {loading ? (
          <div className="empty">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="empty">
            No events yet. Seed the sample events using the backend endpoint.
          </div>
        ) : (
          <div className="event-grid">
            {events.map((event) => (
              <article className="event-card" key={event._id}>
                <div className="card-top">
                  <span className="date-badge">{formatDate(event.date)}</span>
                  <span className={event.availableSeats === 0 ? 'sold-out' : 'seats'}>
                    {event.availableSeats === 0 ? 'Sold out' : `${event.availableSeats} seats left`}
                  </span>
                </div>

                <h3>{event.title}</h3>
                <p>{event.description}</p>

                <div className="meta">
                  <span>📍 {event.location}</span>
                  <span>🎟 {event.totalSeats} total seats</span>
                </div>

                <button
                  className="book-btn"
                  disabled={event.availableSeats === 0}
                  onClick={() => {
                    setSelectedEvent(event);
                    setMessage('');
                  }}
                >
                  {event.availableSeats === 0 ? 'Sold Out' : 'Register & Get Ticket'}
                </button>
              </article>
            ))}
          </div>
        )}

        {ticket && (
          <section className="ticket-success">
            <div>
              <p className="eyebrow">BOOKING CONFIRMED</p>
              <h2>Your ticket is ready 🎉</h2>
              <p>Keep this ticket code for event check-in.</p>
            </div>
            <div className="ticket">
              <div>
                <small>ATTENDEE</small>
                <strong>{ticket.attendee}</strong>
              </div>
              <div>
                <small>EVENT</small>
                <strong>{ticket.eventTitle}</strong>
              </div>
              <div>
                <small>DATE & LOCATION</small>
                <strong>{formatDate(ticket.date)} · {ticket.location}</strong>
              </div>
              <div className="ticket-code">
                <small>TICKET CODE</small>
                <strong>{ticket.ticketCode}</strong>
              </div>
            </div>
          </section>
        )}
      </main>

      {selectedEvent && (
        <div className="modal-backdrop" onMouseDown={() => setSelectedEvent(null)}>
          <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setSelectedEvent(null)}>×</button>
            <p className="eyebrow">RESERVE YOUR SEAT</p>
            <h2>{selectedEvent.title}</h2>
            <p className="modal-event-info">
              {formatDate(selectedEvent.date)} · {selectedEvent.location}
            </p>

            <form onSubmit={handleBooking}>
              <label>
                Full name
                <input
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Your name"
                  required
                />
              </label>

              <label>
                Email address
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </label>

              <button className="confirm-btn" disabled={booking}>
                {booking ? 'Confirming...' : 'Confirm registration'}
              </button>
            </form>
          </div>
        </div>
      )}

      <footer>
        <strong>TechEvents</strong>
        <span>Smart event discovery & ticket booking MVP</span>
      </footer>
    </div>
  );
}