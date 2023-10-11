import mongoose from 'mongoose';

const cleanerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
  },
  phoneNumber: {
    type: Number,
    unique: true,
    required: [true, 'Please provide phone number'],
    validate: {
      validator: function (phoneNumber) {
        const stringValue = phoneNumber.toString();
        return stringValue.length === 10;
      },
      message: 'Phone number should be of 10 digits',
    },
  },
  hostel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hostel',
    required: [true, 'A cleaner must belong to a hostel'],
  },
  rating: {
    type: {
      reviewsCount: {
        type: Number,
        default: 0,
      },
      stars: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
    },
    default: {
      reviewsCount: 0,
      starts: 0,
    },
  },
  attendance: {
    type: [
      {
        type: Date,
        required: true,
      },
    ],
    default: [],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    select: false,
  },
});

const Cleaner = mongoose.model('Cleaner', cleanerSchema);
export default Cleaner;
