import mongoose from 'mongoose';

const supervisorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
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
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
  },
  hostel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hostel',
    required: [true, 'A supervisor must belong to a hostel'],
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    select: false,
  },
});

const Supervisor = mongoose.model('Supervisor', supervisorSchema);
export default Supervisor;
