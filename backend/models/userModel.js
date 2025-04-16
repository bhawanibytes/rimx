import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
<<<<<<< HEAD
  mobile: { type: String, required: false },
=======
  mobileNumber: { type: String, required: true }, // Updated field
>>>>>>> a66be082563da60871823eb7c87aba37b3244a9b
  emailId: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true },
  accountVerified: { type: Boolean, default: false },
  dateOfBirth: { type: Date }, // New field
  country: { type: String, trim: true }, // New field
  bio: { type: String, trim: true }, // New field
  address: { type: String, trim: true }, // New field
},
{
  timestamps: true,
  minimize: false,
});

const User = mongoose.model("User", userSchema);

export default User;