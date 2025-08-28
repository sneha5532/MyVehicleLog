const express = require('express');
require('dotenv').config();
var app = express();
var path = require('path');
var cors = require('cors');
var mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URl)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));
  console.log(process.env.MONGO_URl)

var vehicleRouter = require('./routes/vehicle');

app.use(cors());
app.use(express.json());

// 👇 Serve Angular build
// app.use(express.static(path.join(__dirname, '../server/dist/my-vehicle-log')));

// API routes
app.use('/vehicle', vehicleRouter);

// 👇 Catch-all route to Angular index.html
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../server/dist/my-vehicle-log/index.html'));
// });
app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



// const express = require('express');
// var app = express();
// var path = require('path');
// var cors = require('cors');
// var mongoose = require('mongoose');


// mongoose.connect('mongodb://localhost:27017/MyVehiclelogs').then(() => console.log('MongoDB connected'))
// .catch((err) => console.error('MongoDB connection error:', err));

// var vehicleRouter = require('./routes/vehicle');

// app.use(cors());
// app.use(express.json());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/vehicle', vehicleRouter);


// app.listen(3000,()=>{
//     console.log("Running port 3000")
// })