const express = require('express');
const {imgUpload} = require('../controller/image-upload.controller');

const imgUploadRouter = express.Router();

// You will want a middleware to authenticate the user
imgUploadRouter.get('/', imgUpload);

module.exports = imgUploadRouter;
