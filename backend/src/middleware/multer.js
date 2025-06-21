// middleware/multer.js
import multer from 'multer';

const storage = multer.memoryStorage(); // store in memory buffer
const upload = multer({
  storage,
  limits: { fileSize: 12 * 1024 * 1024 }, // 5MB limit
});

export default upload;
