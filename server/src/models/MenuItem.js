import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, default: 'Signature', trim: true },
  imageUrl: { type: String, required: true },
  imageAlt: { type: String, required: true },
  isVegetarian: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('MenuItem', menuItemSchema);
