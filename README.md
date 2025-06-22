# LifeLong Backend

## Overview
LifeLong is a backend server built with Node.js and Express, designed to support a comprehensive emergency and healthcare platform. It provides APIs for hospital and police station data, emergency FIR filing, donations, volunteer management, and more. The backend integrates with a MongoDB database and supports real-time features via WebSockets.

## Features
- User authentication and SMS-based verification
- Hospital and police station data management
- Emergency FIR filing and tracking
- Donation management
- Volunteer registration and management
- File uploads
- Real-time communication (Socket.IO)
- Search APIs for hospitals and police stations
- Integration with Gemini AI for advanced features

## Tech Stack
- Node.js
- Express.js
- MongoDB (via Mongoose)
- Socket.IO
- EJS (for server-side rendering, if needed)
- CORS, Morgan, Dotenv

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB instance (local or cloud)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/lifelong-backend.git
   cd lifelong-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Create a `.env` file in the root directory and configure the following variables:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   FRONTEND_URL=http://localhost:5173
   # Add other environment variables as needed
   ```
4. Start the server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## API Endpoints

### Main Routes
- `POST /api/sms` - SMS-based authentication
- `GET /api/hospital` - Fetch hospital data
- `POST /api/hospital` - Add new hospital
- `GET /api/police` - Fetch police station data
- `POST /api/police` - Add new police station
- `POST /api/emergency-fir` - File an emergency FIR
- `GET /api/donations` - List donations
- `POST /api/donations` - Make a donation
- `POST /api/upload` - File uploads
- `POST /api/gemini` - Gemini AI integration
- `GET /api/emergency` - Emergency-related endpoints
- `GET /api/volunteers` - List volunteers
- `POST /api/volunteers` - Register as a volunteer
- `GET /api/hospital/search` - Search hospitals
- `GET /api/police/search` - Search police stations

### Health Check
- `GET /health` - Returns `{ status: "ok", message: "Server is running" }`

## Folder Structure
```
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── views/
├── server.js
├── package.json
└── README.md
```

## Environment Variables
- `PORT`: Port number for the server (default: 3000)
- `MONGODB_URI`: MongoDB connection string
- `FRONTEND_URL`: Allowed frontend origin for CORS
- Add any other required variables for third-party integrations

## Contributing
1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License.
