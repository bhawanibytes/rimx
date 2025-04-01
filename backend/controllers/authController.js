import User from '../models/userModel.js';
import { hashPassword, isHashMatched } from '../utils/hashingLogic.js';
import generateToken from '../utils/tokenLogic.js';
import jwt from 'jsonwebtoken';

const signup = async (req, res) => {
    try {
        const { firstName, lastName, emailId, password } = req.body;

        // Returns error if any required field is missing
        if (!firstName || !lastName || !emailId || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Check if the user already exists
        const user = await User.findOne({ emailId });
        if (user) {
            return res.status(400).json({ message: "User already exists", navigate: '/login' });
        }

        // Hash the password and save the user
        const hashedPassword = await hashPassword(password);
        const newUser = new User({ firstName, lastName, emailId, password: hashedPassword });
        await newUser.save();

        return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error("Error during signup:", error.message);
        return res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { emailId, password } = req.body;

        // Returns error if any required field is missing
        if (!emailId || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Find the user by email
        const user = await User.findOne({ emailId });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: `User doesn't exist`,
            });
        }

        // Check if the password matches
        const match = await isHashMatched(password, user.password);
        if (!match) {
            return res.status(401).json({
                success: false,
                message: `Password is incorrect`,
            });
        }

        // Generate a valid JWT token
        const token = generateToken({ id: user._id });
        console.log("Generated Token:", token); // Debugging

        // Return the required JSON response
        return res.status(200).json({
            success: true,
            message: 'loggedIn',
            token,
            user: {
                id: user._id, // MongoDB ID
                name: `${user.firstName} ${user.lastName}`, // Full name
                email: user.emailId, // Email
            },
        });
    } catch (error) {
        console.error("Error during login:", error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization header is missing or invalid' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach the decoded payload to the request
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

export default auth;

export {
    signup,
    login,
};