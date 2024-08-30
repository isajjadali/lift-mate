import fs from 'fs';
import sharp from 'sharp';
import { Readable } from 'stream';
import S3 from 'aws-sdk/clients/s3.js';

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey,
});

async function uploadFile(file, options = {}) {
    let fileStream;
    let compressedFileStream;

    if (options.compress) {
        const compressedImage = await sharp(file.path)
            .jpeg({ quality: 20, ...(options.jpeg || {}) })
            .toBuffer();

        compressedFileStream = new Readable();
        compressedFileStream.push(compressedImage);
        compressedFileStream.push(null);

        const compressedParams = {
            Bucket: bucketName,
            Key: `compressed/${file.name}`,
            Body: compressedFileStream,
        };

        return s3.upload(compressedParams).promise();
    }

    fileStream = fs.createReadStream(file.path);

    const params = {
        Bucket: bucketName,
        Key: file.name,
        Body: fileStream,
    };

    return s3.upload(params).promise();
}

function deleteFile(filePath) {
    const params = {
        Bucket: bucketName,
        Key: filePath,
    };

    return s3.deleteObject(params).promise();
}

export {
    uploadFile,
    deleteFile,
};
