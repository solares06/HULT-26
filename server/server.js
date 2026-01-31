const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Property = require('./models/Property');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173", // For testing on your laptop
    "https://hult-26.vercel.app/" // YOUR Vercel URL (Remove the trailing slash /)
  ]
}));
app.use(express.json());

// In-memory mock data store (fallback when MongoDB is offline)
let mockDataStore = [
  {
    id: 'mock-1',
    title: 'Sunny Acres Solar Farm',
    location: 'Austin, TX',
    roi: 15.5,
    price: 450,
    fundedPercentage: 72,
    capacity: 25.5,
    ownerName: 'John Doe',
    areaSqFt: 2550,
    fundedLevel: 72,
    pricePerPanel: 450,
    totalValue: 114750,
  },
  {
    id: 'mock-2',
    title: 'Desert Sun Rooftop',
    location: 'Phoenix, AZ',
    roi: 17.2,
    price: 520,
    fundedPercentage: 45,
    capacity: 18.2,
    ownerName: 'Jane Smith',
    areaSqFt: 1820,
    fundedLevel: 45,
    pricePerPanel: 520,
    totalValue: 94640,
  },
  {
    id: 'mock-3',
    title: 'Valley View Panels',
    location: 'Denver, CO',
    roi: 14.1,
    price: 480,
    fundedPercentage: 89,
    capacity: 42.0,
    ownerName: 'Mike Johnson',
    areaSqFt: 4200,
    fundedLevel: 89,
    pricePerPanel: 480,
    totalValue: 201600,
  },
];

let useMongoDB = false;

// Mongoose connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sunshare';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    useMongoDB = true;
    console.log('✓ MongoDB connected successfully');
  })
  .catch((err) => {
    useMongoDB = false;
    console.warn('⚠ MongoDB connection failed. Using in-memory mock data.');
    console.warn('  Error:', err.message);
  });

// Helper: Generate unique ID for mock store
const generateId = () => `mock-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

// Helper: Transform property to API response format
const toApiFormat = (p, id) => ({
  id: id || p._id?.toString() || p.id,
  title: p.title,
  location: p.location,
  roi: p.roi,
  price: p.pricePerPanel || p.price,
  fundedPercentage: p.fundedLevel ?? p.fundedPercentage ?? 0,
  capacity: p.capacityKw ?? p.capacity,
  ownerName: p.ownerName,
  areaSqFt: p.areaSqFt,
});

// GET /api/properties
app.get('/api/properties', async (req, res) => {
  try {
    if (useMongoDB) {
      const properties = await Property.find({}).lean();
      const formatted = properties.map((p) => toApiFormat(p, p._id.toString()));
      return res.json(formatted);
    }

    // Fallback: return mock data
    const formatted = mockDataStore.map((p) => toApiFormat(p));
    res.json(formatted);
  } catch (err) {
    console.error('GET /api/properties error:', err);
    // Even on error, return mock data so frontend never crashes
    const formatted = mockDataStore.map((p) => toApiFormat(p));
    res.json(formatted);
  }
});

// POST /api/properties
app.post('/api/properties', async (req, res) => {
  try {
    const { ownerName, title, location, areaSqFt, fundedLevel } = req.body;

    const area = Number(areaSqFt) || 1000;
    const capacityKw = Math.round((area / 100) * 10) / 10;
    const roi = 12 + Math.random() * 6;
    const pricePerPanel = 400 + Math.floor(Math.random() * 200);
    const totalValue = capacityKw * 1000 * 4;
    const funded = Number(fundedLevel) || 0;

    if (useMongoDB) {
      const property = new Property({
        ownerName: ownerName || 'Anonymous',
        title: title || 'New Solar Project',
        location: location || 'TBD',
        areaSqFt: area,
        capacityKw,
        fundedLevel: funded,
        roi: Math.round(roi * 10) / 10,
        pricePerPanel,
        totalValue,
      });
      await property.save();
      const formatted = toApiFormat(property.toObject(), property._id.toString());
      return res.status(201).json(formatted);
    }

    // Fallback: add to mock store
    const newProp = {
      id: generateId(),
      ownerName: ownerName || 'Anonymous',
      title: title || 'New Solar Project',
      location: location || 'TBD',
      areaSqFt: area,
      capacityKw,
      fundedLevel: funded,
      fundedPercentage: funded,
      roi: Math.round(roi * 10) / 10,
      pricePerPanel,
      price: pricePerPanel,
      totalValue,
      capacity: capacityKw,
    };
    mockDataStore.push(newProp);
    const formatted = toApiFormat(newProp);
    res.status(201).json(formatted);
  } catch (err) {
    console.error('POST /api/properties error:', err);
    res.status(500).json({ error: 'Failed to create property' });
  }
});

app.listen(PORT, () => {
  console.log(`SunShare server running on http://localhost:${PORT}`);
});
