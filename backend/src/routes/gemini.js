import express from 'express';
import axios from 'axios';

const router = express.Router();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

router.post('/', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      }
    );

    const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
    res.json({ response: reply });
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ error: 'Gemini API Error' });
  }
});

export default router;