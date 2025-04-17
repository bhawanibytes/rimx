import User from "../models/userModel.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

export const fetchUserData = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming `req.user` is populated by authentication middleware
    const user = await User.findById(userId).select("-password"); // Exclude password from the response

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch user data" });
  }
};

export const editUserData = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming `req.user` is populated by authentication middleware
    const { firstName, lastName, mobileNumber, address, country, dateOfBirth, bio } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, mobileNumber, address, country, dateOfBirth, bio },
      { new: true, runValidators: true }
    ).select("-password"); // Exclude password from the response

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating user data:", error.message);
    res.status(500).json({ success: false, message: "Failed to update user data" });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming `req.user` is populated by authentication middleware

    // Delete user from the User collection
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Remove user from all related collections (e.g., Memberships, Organizations, etc.)
    await Membership.deleteMany({ user: userId });
    await Organization.updateMany(
      { members: userId },
      { $pull: { members: userId } }
    );

    res.status(200).json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error.message);
    res.status(500).json({ success: false, message: "Failed to delete account" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id; // Get the user ID from the authenticated request
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Both current and new passwords are required" });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if the current password matches the one in the database
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the password
    user.password = hashedPassword;

    // Save the user document
    await user.save();

    res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error.message);
    res.status(500).json({ success: false, message: "Failed to change password" });
  }
};