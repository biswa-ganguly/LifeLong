import React, { useState } from 'react';
import axios from 'axios';

function AIAgent() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    const prompt = `
You are an AI assistant in an emergency app.

A user is sending this message:
"${input}"

Your job:
1. Identify if the message is about DONATION or INCIDENT REPORT.
2. Extract relevant data:
- For donation: name, organ or blood group, location, contact, urgency
- For incident report: type (accident/suicide/other), description, location, time, victim details, contact
3. Return a JSON like:
{
  "intent": "donate" | "report",
  "data": {
    ...
  }
}
Only include fields if mentioned, leave others empty.
`;

    try {
      const res = await axios.post('http://localhost:3000/api/gemini', { prompt });
      setResponse(res.data.response);
    } catch (error) {
      console.error(error);
      setResponse('Error contacting AI.');
    }
    setLoading(false);
  };

  return (
    <div className="p-4 space-y-4">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={4}
        className="w-full border p-2"
        placeholder="Describe your situation or donation..."
      />
      <button onClick={handleSend} className="bg-blue-600 text-white px-4 py-2">
        {loading ? 'Processing...' : 'Send to AI'}
      </button>
      {response && (
        <div className="bg-gray-100 p-4 mt-4 rounded">
          <pre>{response}</pre>
        </div>
      )}
    </div>
  );
}

export default AIAgent;
