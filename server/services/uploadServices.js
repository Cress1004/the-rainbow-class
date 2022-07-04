const multer = require("multer");
var MulterAzureStorage = require("multer-azure-storage");

const storageMulter = (containerName) => {
  return new MulterAzureStorage({
    azureStorageConnectionString: `DefaultEndpointsProtocol=https;AccountName=${process.env.BLOB_STORAGE_ACCOUNT};AccountKey=${process.env.BLOB_STORAGE_KEY};EndpointSuffix=${process.env.BLOB_ENDPOINT_SUFFIX}`,
    containerName: containerName,
    containerSecurity: "blob",
  })
}

var uploadImage = multer({storage: storageMulter("avatars")});

const uploadCVFile = multer({ storage: storageMulter("cv-data")});

module.exports = { uploadCVFile, uploadImage };
