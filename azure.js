const { BlockBlobClient } = require("@azure/storage-blob");
const { v1: uuidv1 } = require("uuid");
const getStream = require("into-stream");
require("dotenv").config();


// upload file
const uploadFile = async (file) => {
    const ext = file.mimetype.split("/").pop();
    const blobName = `${file.originalname}-${uuidv1()}.${ext}`;

    const service = new BlockBlobClient(
        process.env.AZURE_STORAGE_CONNECTION_STRING, 
        process.env.AZURE_BLOB_CONTAINER,
        blobName 
    );

    const stream = getStream(file.buffer);
    const streamLength = file.buffer.length;

    await service.uploadStream(stream, streamLength);

    return process.env.AZURE_URL + blobName;
}

// delte file
const deleteFile = async (file) => {
    const blobName = file.split("/").pop();

    const service = new BlockBlobClient(
        process.env.AZURE_STORAGE_CONNECTION_STRING, 
        process.env.AZURE_BLOB_CONTAINER,
        blobName 
    );

    const options = {
        deleteSnapshots: "include"
    }

    await service.delete(options);
}

module.exports = {
    uploadFile,
    deleteFile
}