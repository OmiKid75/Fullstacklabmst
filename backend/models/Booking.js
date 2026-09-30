import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  userName: { type: String, required: true, trim: true },
  userEmail: { type: String, required: true, trim: true, lowercase: true },
  ticketCode: { type: String, required: true, unique: true }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);