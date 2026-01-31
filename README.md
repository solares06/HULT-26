# SunShare - Solar Energy Marketplace

A dual-sided MERN stack prototype where **landowners** list roofs/land for solar installation and **consumers** invest by buying panels to earn electricity credits.

## Quick Start

### 1. Install Dependencies

```bash
# Backend
cd server && npm install

# Frontend (in new terminal)
cd client && npm install
```

### 2. Run the App

```bash
# Terminal 1 - Start backend (port 5000)
cd server && npm start

# Terminal 2 - Start frontend (port 5173)
cd client && npm run dev
```

### 3. Open

Visit **http://localhost:5173**

---

## Robustness: MongoDB Fallback

If MongoDB is not installed or offline, the backend **automatically uses in-memory mock data**. The frontend will never crash—it will always receive property data (from DB or mock store).

---

## Project Structure

```
HULT'26/
├── server/
│   ├── server.js          # Express app, CORS, routes, MongoDB + mock fallback
│   ├── models/
│   │   └── Property.js    # Mongoose schema
│   └── package.json
├── client/
│   ├── src/
│   │   ├── App.jsx        # Main React app (views, state, API calls)
│   │   ├── App.css        # Design system (emerald green theme)
│   │   └── main.jsx       # React entry
│   ├── index.html
│   ├── vite.config.js     # Vite + API proxy to backend
│   └── package.json
└── README.md
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/properties` | List all solar sites |
| POST | `/api/properties` | Create new listing (ownerName, title, location, areaSqFt) |

---

## MongoDB (Optional)

To use MongoDB instead of mock data:

1. Install MongoDB locally or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Set `MONGODB_URI` env var or use default `mongodb://localhost:27017/sunshare`
3. Restart the server
