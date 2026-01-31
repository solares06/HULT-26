const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  ownerName: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  areaSqFt: {
    type: Number,
    required: true,
  },
  capacityKw: {
    type: Number,
    default: 0,
  },
  fundedLevel: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  roi: {
    type: Number,
    default: 15,
  },
  pricePerPanel: {
    type: Number,
    default: 500,
  },
  totalValue: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

propertySchema.pre('save', function (next) {
  if (this.areaSqFt && !this.capacityKw) {
    this.capacityKw = Math.round((this.areaSqFt / 100) * 10) / 10;
  }
  next();
});

module.exports = mongoose.model('Property', propertySchema);
