import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
  },
  enrollmentNumber: {
    type: Number,
    required: [true, 'Please provide your enrollment number'],
    unique: true,
    validate: {
      validator: function (enrollmentNumber) {
        const stringValue = enrollmentNumber.toString();
        return stringValue.length === 9;
      },
      message: 'Enrollment number should be of nine digits',
    },
  },
  phoneNumber: {
    type: Number,
    unique: true,
    required: [true, 'Please provide your phone number'],
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
    required: [true, 'A student must belong to a hostel'],
  },
  roomNumber: {
    type: Number,
    validate: {
      validator: function (roomNumber) {
        const stringValue = roomNumber.toString();
        return stringValue.length === 3;
      },
      message: 'Room number should be of 3 digits',
    },
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    select: false,
  },
});

const Student = mongoose.model('Student', studentSchema);
export default Student;
