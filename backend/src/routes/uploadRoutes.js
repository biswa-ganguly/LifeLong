// routes/uploadRoutes.js
import express from 'express';
import upload from '../middleware/multer.js';
import { uploadImage } from '../controller/uploadController.js';

const router = express.Router();

router.post('/upload-image', upload.single('image'), uploadImage);

export default router;
