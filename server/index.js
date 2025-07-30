const express = require('express');
var app = express();
var path = require('path');
var cors = require('cors');
var mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/MyVehiclelogs').then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

var vehicleRouter = require('./routes/vehicle');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/vehicle', vehicleRouter);


app.listen(3000,()=>{
    console.log("Running port 3000")
})