
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');


const cors=require('cors');


const authRoute=require('./routes/auth');
const userRoute=require('./routes/user');
const taskRoute=require('./routes/taskback');

dotenv.config();

const app=express();

app.use(express.json());
app.use(cors());

app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Database connected');
    })
    .catch((err) => {
        console.log(err);
    });


    app.use('/api/auth', authRoute);
    app.use('/api/user', userRoute);
    app.use('/api/tasks', taskRoute);


    app.listen(8000, () => {
        console.log('Server is running on 8000');
    });



