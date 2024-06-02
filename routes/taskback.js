const express = require('express');
const router = express.Router();
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const verify = require('../verifyToken');

// Create tasks
router.post('/create', async (req, res) => {
     const {name,description,date,time,userId} = req.body;

        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }
            user.tasks.push({ name, description, date, time });
            await user.save();
            return res.status(201).json({ message: "Task created successfully!" });
        } catch (err) {
            console.error("Error creating task:", err);
            return res.status(500).json({ message: "Internal server error." });
        }
});

module.exports = router;
