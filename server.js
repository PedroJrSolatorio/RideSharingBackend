const express = require('express');
const cors = require('cors');
const cloudinary = reqiure('cloudinary').v2;
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000; // Render will set the PORT environment variable

// 1. Configure CORS
// IMPORTANT: Only allow your front-end domain in a production setting.
// for testing, we use *
app.use(cors());

// 2. Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
})

// 3. Define Signature Endpoint
app.get('/api/upload/signature', (req, res) => {
    try{
        // Define the parameters for the upload. This makes the upload secure.
        const timestamp = Math.round((new Date()).getTime() / 1000);
        const folder = "ride_sharingapp_profiles"; // Specify a dedicated folder

        const paramsToSign = {
            timestamp: timestamp,
            folder: folder
            // You can add public_id, tags, etc. here if needed
        };

        // Generate the signature using the Cloudinary SDK
        const signature = cloudinary.utils.api_sign_request(
            paramsToSign,
            cloudinary.config().api_secret
        );

        // Send the signature and the required parameters back to the client
        res.json({
            signature: signature,
            timestamp: timestamp,
            cloudName: cloudinary.config().cloud_name,
            apiKey: cloudinary.config().api_key,
            folder: folder
        });
    } catch(error){
        console.error("Error generating signature:", error);
        res.status(500).json({error: "Failed to generate upload signature."})
    }
});

// Simple health check endpoint
app.get('/', (req, res) => {
    res.send('Cloudinary Signature Service is Running.')
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});