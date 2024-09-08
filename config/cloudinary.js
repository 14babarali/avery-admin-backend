// config-cloudinary.js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = async (file, folderName) => {
  const options = {
    folder: folderName,
    public_id: `${folderName}/${Date.now()}`,
  };

  try {
    const image = await cloudinary.uploader.upload(file, options);
    return image;
  } catch (error) {
    throw error;
  }
};

const uploadBase64 = async (base64Data, folderName) => {
  const options = {
    folder: folderName,
    public_id: `${folderName}/${Date.now()}`,
  };

  try {
    const image = await cloudinary.uploader.upload(`data:image/png;base64,${base64Data}`, options);
    return image;
  } catch (error) {
    throw error;
  }
};

module.exports = { upload, uploadBase64 };