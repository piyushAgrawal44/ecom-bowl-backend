const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Cloudinary config — replace with your actual credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SEC
});

// Function to upload image buffer to Cloudinary
exports.cloudinaryUpload = async (image) => {
  try {
    let imageUrl = '';
    let imageKey = '';

    if (!image || !image.buffer) {
      console.warn('No image buffer provided');
      return { imageUrl, imageKey };
    }

    const streamUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'my_uploads' }, // optional folder in Cloudinary
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );

        streamifier.createReadStream(image.buffer).pipe(stream);
      });
    };

    const result = await streamUpload();
    imageUrl = result.secure_url;
    imageKey = result.public_id;

    return { imageUrl, imageKey };

  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return { imageUrl: '', imageKey: '' };
  }
};
