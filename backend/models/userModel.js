import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  emailId: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true },
  accountVerified: { type: Boolean, default: false },
},
  {
    timestamps: true,
    minimize: false,
  });

const User = mongoose.model("User", userSchema);

export default User;