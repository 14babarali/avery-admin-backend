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
    order_id: { type: String, unique: true, required: true }, 
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
      postcode: { type: String },
    },
    phone: { type: String },
    order_name: { type: String },
    line_items: [lineItemSchema],
    account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' }, // Reference to the Account schema
  });
  

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
