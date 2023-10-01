import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  cleaner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cleaner',
    default: NULL,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student ID is required'],
  },
  hostel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hostel',
    requires: [true, 'A booking must belong to a hostel'],
  },
  slots: {
    type: [
      {
        type: String,
        required: true,
      },
    ],
    default: [],
  },
  status: {
    type: String,
    enum: ['Unassigned', 'Assigned', 'Completed'],
    default: 'Unassigned',
  },
  result: {
    status: {
      type: String,
      enum: ['', 'Success', 'Failed'],
      default: '',
    },
    reason: {
      type: String,
      default: '',
    },
  },
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
