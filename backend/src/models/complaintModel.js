import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: [true, 'A complaint should be attached to a booking'],
  },
  message: {
    type: String,
    requred: [true, 'Please state your complaint'],
  },
});

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
