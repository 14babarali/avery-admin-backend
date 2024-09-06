// Assuming you're using Mongoose
const mongoose = require('mongoose');

const lineItemSchema = new mongoose.Schema({
  product_id: { type: Number, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  subtotal: { type: String },
  total: { type: String },
});

const orderSchema = new mongoose.Schema({
  order_key: { type: String, required: true },
  total: { type: String, required: true },
  subtotal: { type: String },
  date_created: { type: Date, required: true },
  date_modified: { type: Date },
  status: { type: String, required: true },
  archived: { type: Boolean, default: false },
  customer: {
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String },
  },
  
phone: { type: String },
plan: { type: String },

  line_items: [lineItemSchema],
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
