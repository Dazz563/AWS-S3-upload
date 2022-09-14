const express = require('express');
const cors = require('cors');

const imgUploadRoutes = require('./routes/image-upload.router');

const app = express();

// Setting cors
app.use(
    cors({
        origin: '*',
    })
);

// This will parse incoming JSON
app.use(express.json());

// Router middleware
app.use('/api/upload', imgUploadRoutes);

module.exports = app;
