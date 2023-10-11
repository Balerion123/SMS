import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  cleaner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cleaner',
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
  bookingTime: {
    type: Date,
    required: [true, 'Time of booking is required'],
  },
  slots: {
    type: [
      {
        type: String,
        required: true,
      },
    ],
    default: [],
    validate: {
      validator: function (slots) {
        return slots.length >= 1 && slots.length <= 3;
      },
      message: 'Provide between 1 and 3 slots',
    },
  },
  status: {
    type: String,
    enum: ['Unassigned', 'Assigned', 'Completed'],
    default: 'Unassigned',
  },
  result: {
    type: {
      status: {
        type: String,
        enum: ['Success', 'Failed'],
      },
      reason: {
        type: String,
      },
    },
    default: {},
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  complaint: {
    type: String,
    default: '',
  },
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
