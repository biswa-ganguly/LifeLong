// src/routes/gemini.js
import express from 'express';
import axios from 'axios';

const router = express.Router();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

router.post('/', async (req, res) => {
  const { prompt } = req.body;

  // Check if API key exists
  if (!GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not found in environment variables');
    return res.status(500).json({ error: 'Gemini API key not configured' });
  }

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    console.log('🔄 Sending request to Gemini API...');
    
    const geminiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 seconds timeout
      }
    );

    console.log('✅ Gemini API response received');
    
    const aiText = geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!aiText) {
      console.error('❌ No content returned by Gemini:', geminiRes.data);
      return res.status(500).json({ error: 'No content returned by Gemini' });
    }

    res.json({ response: aiText });
  } catch (err) {
    console.error('❌ Gemini API error:');
    console.error('Status:', err?.response?.status);
    console.error('Status Text:', err?.response?.statusText);
    console.error('Data:', err?.response?.data);
    console.error('Message:', err.message);
    
    // Return more specific error messages
    if (err?.response?.status === 400) {
      return res.status(500).json({ error: 'Invalid request to Gemini API' });
    } else if (err?.response?.status === 403) {
      return res.status(500).json({ error: 'Gemini API key invalid or insufficient permissions' });
    } else if (err?.response?.status === 429) {
      return res.status(500).json({ error: 'Gemini API rate limit exceeded' });
    } else {
      return res.status(500).json({ error: 'Gemini API failed' });
    }
  }
});

export default router;