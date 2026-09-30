import express from 'express';
import Event from '../models/Event.js';
import Booking from '../models/Booking.js';

const router = express.Router();

const makeTicketCode = () =>
  `TECH-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

// Get upcoming events
router.get('/events', async (req, res) => {
  try {
    const events = await Event.find({}).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Seed sample events for testing
router.post('/events/seed', async (req, res) => {
  try {
    await Event.deleteMany({});

    const sampleEvents = [
      {
        title: 'React & Modern Frontend Summit',
        description: 'Explore modern React patterns, performance and scalable frontend architecture.',
        date: '2026-10-18',
        location: 'Online / Zoom',
        totalSeats: 100,
        availableSeats: 100
      },
      {
        title: 'Node.js Backend Architecture Meetup',
        description: 'Learn practical approaches to APIs, databases, authentication and scalable Node.js systems.',
        date: '2026-11-07',
        location: 'New Delhi, India',
        totalSeats: 60,
        availableSeats: 60
      },
      {
        title: 'AI & Data Engineering Conference',
        description: 'A beginner-friendly tech event covering AI applications, data pipelines and analytics.',
        date: '2026-12-05',
        location: 'Chandigarh, India',
        totalSeats: 150,
        availableSeats: 150
      }
    ];

    const created = await Event.insertMany(sampleEvents);
    res.status(201).json({ message: 'Events seeded successfully!', created });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Book one seat and generate a ticket code
router.post('/bookings', async (req, res) => {
  try {
    const { eventId, userName, userEmail } = req.body;

    if (!eventId || !userName?.trim() || !userEmail?.trim()) {
      return res.status(400).json({ message: 'Name, email and event are required.' });
    }

    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail);
    if (!emailIsValid) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    const event = await Event.findOneAndUpdate(
      { _id: eventId, availableSeats: { $gt: 0 } },
      { $inc: { availableSeats: -1 } },
      { new: true }
    );

    if (!event) {
      return res.status(400).json({ message: 'Sorry, this event is sold out or no longer exists.' });
    }

    try {
      const booking = await Booking.create({
        eventId,
        userName: userName.trim(),
        userEmail: userEmail.trim(),
        ticketCode: makeTicketCode()
      });

      res.status(201).json({
        message: 'Successfully booked!',
        booking,
        event,
        ticket: {
          ticketCode: booking.ticketCode,
          eventTitle: event.title,
          date: event.date,
          location: event.location,
          attendee: booking.userName,
          email: booking.userEmail
        }
      });
    } catch (bookingError) {
      await Event.findByIdAndUpdate(eventId, { $inc: { availableSeats: 1 } });
      throw bookingError;
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;