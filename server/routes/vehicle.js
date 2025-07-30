var express = require('express');
var router = express.Router();
const multer = require('multer');
const XLSX = require('xlsx');

const vehicleModel = require('../model/vehicle.model');


router.get('/vehicle-list', async function (req, res) {
  try {
    const vehicleList = await vehicleModel.find(); // no callback here
    const recordCount = vehicleList.length;

    res.status(200).send({
      status: 200,
      message: 'Vehicle list fetched successfully',
      count: recordCount,
      result: vehicleList
    });
  } catch (err) {
    console.error('Error retrieving vehicles:', err);
    res.status(500).send({
      status: 500,
      message: 'Unable to retrieve vehicle list',
      error: err.message
    });
  }
});



router.post('/add-vehicle',async function(req,res){
    try{
    const {vehicleNo,eNo,surveyDate,riDate,location}= req.body;
    let vehicleObj = new vehicleModel({
        vehicleNo: vehicleNo,
        eNo: eNo,
        surveyDate: surveyDate,
        riDate: riDate,
        location: location
    })
   const savedVehicle = await vehicleObj.save();
    res.status(200).send({
      status: 200,
      message: 'Vehicle added successfully',
      vehicleDetails:savedVehicle  
    })
  }catch (err) {
    console.error('Error adding vehicle:', err);
    res.status(500).send({
      status: 500,
      message: 'Unable to add vehicle',
      error: err.message
    });
  }
})


router.get('/location-vehicle', async (req, res) => {
  const location = req.query.location;

  try {
    const vehicles = await vehicleModel.find({ location: location });
    res.status(200).send({
      status: 200,
      message: 'Location wise Vehicle list fetched successfully',
      vehiclesLocationList: vehicles
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


const storage = multer.memoryStorage();
const upload = multer({ storage });

// API to receive Excel file
router.post('/upload-excel', upload.single('file'), async (req, res) => {
 try {
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  const excelDateToJSDate = (serial) => {
  if (!serial || isNaN(serial) || Number(serial) === 0) {
    return null; // return null for empty, invalid, or zero serials
  }
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  return new Date(utc_value * 1000);
};

    const cleanedData = rawData
      .filter(row => row['Vehicle No.']) // skip empty rows
      .map(row => ({
        vehicleNo: (row['Vehicle No.'] || '').trim(),
        eNo: (row['E.No.'] || '').trim(),
        surveyDate: excelDateToJSDate(row['D.O. Survey']),
        riDate: excelDateToJSDate(row['R.I. Date']),
        location: (row['Location'] || '').trim()
      }));

    const bulkOps = cleanedData.map(row => ({
  updateOne: {
    filter: {
      vehicleNo: row.vehicleNo,
      surveyDate: row.surveyDate
    },
    update: {
      $set: {
        eNo: row.eNo,
        riDate: row.riDate,
        location: row.location,
        updatedAt: new Date()
      }
    },
    upsert: true
  }
}));

const result = await vehicleModel.bulkWrite(bulkOps);

const message = [];
if (result.upsertedCount > 0) {
  message.push(`${result.upsertedCount} record(s) inserted.`);
}
if (result.modifiedCount > 0) {
  message.push(`${result.modifiedCount} record(s) updated.`);
}
if (result.upsertedCount === 0 && result.modifiedCount === 0) {
  message.push(`No changes were made. All records already exist.`);
}

res.status(200).json({
  message: message.join(' '),
  inserted: result.upsertedCount,
  updated: result.modifiedCount
});
  } catch (err) {
    console.error('Upload failed:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;