const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    order_key: String,
    phone: String,
    plan: String,
    customer: {
        first_name: String,
        last_name: String,
        email: String,
    },
    subtotal: String,
    total: String,
    date_created: Date,
    date_modified: Date,
    status: String,
});

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;
