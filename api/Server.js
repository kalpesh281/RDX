const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// Create an Express application
const app = express();


app.use(express.json());

const mongoURI = 'mongodb+srv://kalpeshsenva28:kMOHYFgWcKoYA711@cluster0.gii4hsa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';



app.use(cors());

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));


const Schema = mongoose.Schema;


const CustomDataSchema = new Schema({
    districtName: String,
    talukaName: String,
    gramPanchayatName: String,
    villageName: String
});


const CustomData = mongoose.model('CustomData', CustomDataSchema);


// app.post('/addCustomData', async (req, res) => {
//     try {
//         const { districtName, talukaName, gramPanchayatName, villageName } = req.body;

        
//         const newCustomData = new CustomData({
//             districtName: districtName,
//             talukaName: talukaName,
//             gramPanchayatName: gramPanchayatName,
//             villageName: villageName
//         });

//         // Save the new document to the database
//         await newCustomData.save();

//         return res.status(201).json({ message: 'Custom data saved successfully' });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Server Error' });
//     }
// });


app.post('/getVillageNames', async (req, res) => {
    try {
        const { districtName, talukaName, gramPanchayatName } = req.body;

        
        const districtNameUpper = districtName.toUpperCase();
        const talukaNameUpper = talukaName.toUpperCase();
        const gramPanchayatNameUpper = gramPanchayatName.toUpperCase();

       
        const villages = await CustomData.find({
            districtName: districtNameUpper,
            talukaName: talukaNameUpper,
            gramPanchayatName: gramPanchayatNameUpper
        }).select('villageName villageCode villageKannadaName villageLgdCode');

        console.log()
        
        return res.status(200).json(villages);
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});














// Define a Mongoose model
// const Data = mongoose.model('test_data', DataSchema);

// Define a route to handle user input and fetch villages
// app.post('/getVillages', async (req, res) => {
//     try {
//         const { districtName, talukaName, gramPanchayatName } = req.body;
//         console.log(req.body);
//         // Ensure case insensitivity by converting all fields to uppercase
//         const districtNameUpper = districtName.toUpperCase();
//         const talukaNameUpper = talukaName.toUpperCase();
//         const gramPanchayatNameUpper = gramPanchayatName.toUpperCase();
//         const villages = await Data.find({
//             districtName: districtNameUpper,
//             talukaName: talukaNameUpper,
//             gramPanchayatName: gramPanchayatNameUpper
//         }).select('villageName');
//         return res.status(200).json(villages);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Server Error' });
//     }
// });

// Start the server on port 8000
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server running on port ${port}`));








app.get('/districtName', async (req, res) => {
    try {
        const districtNames = await CustomData.distinct('districtName');
        console.log(districtNames)
        return res.status(200).json(districtNames);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.post('/talukaNames', async (req, res) => {
    try {
        const { districtName } = req.body;
        const talukaNames = await CustomData.distinct('talukaName', { districtName: districtName });
        console.log(talukaNames)
        return res.status(200).json(talukaNames);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});


app.post('/gramPanchayatNames', async (req, res) => {
    try {
        const { districtName, talukaName } = req.body;
        console.log("Request Body:", req.body);
        const gramPanchayatNames = await CustomData.distinct('gramPanchayatName', { districtName: districtName, talukaName: talukaName });
        console.log("Gram Panchayat Names:", gramPanchayatNames);
        if (!gramPanchayatNames.length) {
            return res.status(404).json({ message: 'No gram panchayat names found for the provided district and taluka.' });
        }
        return res.status(200).json(gramPanchayatNames);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
})
