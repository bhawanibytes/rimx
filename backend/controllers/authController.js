import User from '../models/userModel.js';
import { hashPassword, isHashMatched } from '../utils/hashingLogic.js';
import generateToken from '../utils/tokenLogic.js';
// const { verifyToken } = require("../utils/verifyToken");

const signup = async (req, res) => {
    try {
        const { firstName, lastName, emailId, password } = req.body;
        //returns request if any one things is not submitted
        if (!firstName || !lastName || !emailId || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        //find whether user already exists
        const user = await User.findOne({ emailId })
        if (user) {
            return res.status(400).json({ message: "User already exists", navigate: '/login' });
        } else {
            try {
                const hashedPassword = await hashPassword(password)
                const newUser = new User({ firstName, lastName, emailId, password: hashedPassword })
                await newUser.save();
                return res.status(201).json({ message: "User created successfully" });
            } catch (error) {
                return res.status(400).json({ response: "Error while saving User to DB", message: error.message });
            }
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message });
    }
}

const login = async (req, res) => {
    try {
        const { emailId, password } = req.body;
        //returns request if any one things is not submitted
        if (!emailId || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const user = await User.findOne({ emailId })
        if (!user) {
            return res.json({
                message: `User doesn't exist`
            })
        } else {
            const match = await isHashMatched(password, user.password)
            if (match) {
                const token = generateToken({emailId})
                return res.json({
                    success: true,
                    message: 'loggedIn',
                    token
                })
            } else {
                return res.json({ message: `Password is incorrect` })
            }
        }
    } catch (error) {
        return res.json({ message: error.message })
    }
}

// const verify = async (req, res) => { }

// const resendOTP = async (req, res) => { }

// const logout = async (req, res) => { }

// const forgotPassword = async (req, res) => { }

// const resetPassword = async (req, res) => { }

// const updatePassword = async (req, res) => { }




export {
    signup,
    login,
    // verify,
    // resendOTP,
    // logout,
    // forgotPassword,
    // resetPassword,
    // updatePassword
}