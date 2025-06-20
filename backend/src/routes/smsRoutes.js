import express from 'express';
import { showSendForm, sendSMS } from '../controller/smsController.js';

const router = express.Router();

router.get('/', showSendForm);
router.post('/send-sms', sendSMS);

export default router;