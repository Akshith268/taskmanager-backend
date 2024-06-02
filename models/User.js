const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    date: Date,
    time: String,
    completed:{
        type:Boolean,
        default:false,
    }
}, { timestamps: true });

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        default: ""
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    tasks: [taskSchema] // Embedding tasks within the user document
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
