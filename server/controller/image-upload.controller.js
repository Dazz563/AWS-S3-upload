const AWS = require('aws-sdk');
const uuid = require('uuid');

require('dotenv').config();

const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

exports.imgUpload = (req, res, next) => {
    const key = `user/${uuid.v4()}.jpeg`;

    s3.getSignedUrl(
        'putObject',
        {
            Bucket: 'image-upload-node-test',
            ContentType: 'image/jpeg',
            Key: key,
        },
        (err, url) => {
            res.send({key, url});
        }
    );
};

exports.create = (req, res, next) => {
    const {title, content, imageUrl} = req.body;
};
