const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs"); // For file system operations (if you're uploading local files)
const crypto = require("crypto");


const REGION = "us-east-1"; // Update to your bucket's region
const BUCKET_NAME = "uottawa7"; // Replace with your bucket name

// Initialize S3 client
const s3Client = new S3Client({ region: REGION , credentials: {
        accessKeyId: process.env.aws_access_key_id, // Replace with your Access Key ID
        secretAccessKey: process.env.aws_secret_access_key,
    }});

async function uploadImage(contents) {
    try {
        // Read the file from the local filesystem
        const filename = Date.now()+crypto.randomBytes(8).toString('hex');
        // Prepare the S3 upload parameters
        const uploadParams = {
            Bucket: BUCKET_NAME,
            Key: filename, // Name for the file in the bucket
            Body: contents.buffer,
            ContentType: "image/jpeg", // Update based on your file type
        };

        // Upload the file to S3
        const command = new PutObjectCommand(uploadParams);
        const response = await s3Client.send(command);

        const url = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${filename}`
        console.log("Added to AWS");
        return {url};
    } catch (err) {
        return {error: true};
    }
}

module.exports = uploadImage;