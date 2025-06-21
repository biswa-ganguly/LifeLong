// controllers/uploadController.js
import cloudinary from '../config/cloudinary.js';

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }

    const result = await cloudinary.uploader.upload_stream(
      {
        folder: 'accident_reports',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          return res.status(500).json({ message: 'Cloudinary upload failed', error });
        }

        return res.status(200).json({ message: 'Upload successful', url: result.secure_url });
      }
    );

    result.end(req.file.buffer); // send image buffer to cloudinary
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.toString() });
  }
};
