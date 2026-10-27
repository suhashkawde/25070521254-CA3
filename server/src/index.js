import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import MenuItem from './models/MenuItem.js';
import Reservation from './models/Reservation.js';

const app = express();
const port = process.env.PORT || 5000;
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

const seedMenu = [
  { name: 'Truffle Duck', description: 'Slow-roasted duck breast with a honey-truffle glaze and seasonal vegetables.', price: 1450, category: 'Chef’s signature', imageUrl: 'https://images.unsplash.com/photo-1514361892635-6b07e31e75f9?auto=format&fit=crop&w=900&q=85', imageAlt: 'Elegant plated restaurant dish', isVegetarian: false },
  { name: 'Paneer Tikka', description: 'Charcoal-grilled paneer marinated with warming spices and a touch of cream.', price: 850, category: 'From the tandoor', imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=85', imageAlt: 'Indian curry served with fresh herbs', isVegetarian: true },
  { name: 'Awadhi Biryani', description: 'Fragrant basmati rice, slow-cooked dum style with a blend of Awadhi spices.', price: 1200, category: 'House favourite', imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=900&q=85', imageAlt: 'Traditional biryani with aromatic rice', isVegetarian: false }
];

app.get('/api/health', (_req, res) => res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' }));
app.get('/api/menu', async (_req, res, next) => {
  try { res.json(await MenuItem.find({ isAvailable: true }).sort({ createdAt: 1 })); } catch (error) { next(error); }
});
app.post('/api/reservations', async (req, res, next) => {
  try {
    const { name, email, phone, date, time, guests, message } = req.body;
    if (!name || !email || !phone || !date || !time || !guests) {
      return res.status(400).json({ message: 'Please complete all required fields.' });
    }
    const reservation = await Reservation.create({ name, email, phone, date, time, guests, message });
    return res.status(201).json({ message: 'Your request has been received. We’ll be in touch to confirm.', reservation });
  } catch (error) {
    if (error.name === 'ValidationError') return res.status(400).json({ message: error.message });
    return next(error);
  }
});
app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: 'Something went wrong. Please try again.' });
});

async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/balaji_restaurant');
    if (await MenuItem.countDocuments() === 0) await MenuItem.insertMany(seedMenu);
    app.listen(port, () => console.log(`Balaji API listening on http://localhost:${port}`));
  } catch (error) {
    console.error('Could not connect to MongoDB. Start the local MongoDB server and check MONGODB_URI.', error.message);
    process.exit(1);
  }
}

start();
