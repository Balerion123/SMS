import mongoose, { Mongoose } from 'mongoose';

const hostelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A hostel must have a name'],
    unique: true,
  },
  abbreviatedName: {
    type: String,
    required: [true, 'A hostel must have an abbreviated name'],
    unique: true,
  },
});

hostelSchema.virtual('supervisor', {
  ref: 'Supervisor',
  foreignField: 'hostel',
  localField: 'i',
});

hostelSchema.virtual('cleaners', {
  ref: 'Cleaner',
  foreignField: 'hostel',
  localField: '_id',
});

const Hostel = mongoose.model('Hostel', hostelSchema);
export default Hostel;
