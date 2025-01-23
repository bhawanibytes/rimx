const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sendOTP } = require("../utils/sendOTP");
const { sendEmail } = require("../utils/sendEmail");
const { generateToken } = require("../utils/generateToken");
const { verifyToken } = require("../utils/verifyToken");
const { generateOTP } = require("../utils/generateOTP");
const { verifyOTP } = require("../utils/verifyOTP");
const { sendSMS } = require("../utils/sendSMS");

const signup = async (req, res) => {
    const { number } = req.body;
    try {
      const user = await User.findOne({ mobile: number });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }else{
            const newUser = new User({
                mobile: number
            });
            await newUser.save();
            return res.status(201).json({ message: "User created successfully" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const verify = async (req, res) => {}

const resendOTP = async (req, res) => {}

const login = async (req, res) => {}

const logout = async (req, res) => {}

const forgotPassword = async (req, res) => {}

const resetPassword = async (req, res) => {}

const updatePassword = async (req, res) => {}




module.exports = {
    signup,
    verify,
    resendOTP,
    login,
    logout,
    forgotPassword,
    resetPassword,
    updatePassword
}