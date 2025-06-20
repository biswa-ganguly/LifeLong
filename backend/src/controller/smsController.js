import twilio from 'twilio';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Twilio client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const showSendForm = (req, res) => {
  res.render('sms-form'); // Your EJS view
};

export const sendSMS = async (req, res) => {
  const { phoneNumber, message } = req.body;

  try {
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });

    res.render('sms-result', { 
      success: true,
      message: 'SMS sent successfully!',
      sid: result.sid
    });
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.render('sms-result', {
      success: false,
      message: `Failed to send SMS: ${error.message}`
    });
  }
};