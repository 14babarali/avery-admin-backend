
const { Order } = require("../models");



exports.webhook = async (req, res) => {
    try {
        const orderData = req.body;
        // Log the order data being processed
        console.log('Processing order data:', orderData);
        // Save or update order in the database
        const existingOrder = await Order.findOne({ order_key: orderData.order_key });
        if (existingOrder) {
            await Order.updateOne({ order_key: orderData.order_key }, orderData);
        } else {
            await new Order(orderData).save();
        }
        res.status(200).send('Webhook data saved!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error saving webhook data');
    }
}


  exports.getOrders = async (req, res) => {
    const { search } = req.query;
    const query = search ? { 'customer.email': new RegExp(search, 'i') } : {};
    const orders = await Order.find(query).sort({ date_created: -1 });
    res.json(orders);
};


  exports.upDateOrder =  async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ error: 'Error updating order' });
    }
};


// Update or delete order
exports.archiveOrder = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedOrder = await Order.findByIdAndUpdate(id, { archived: true }, { new: true });
        res.json(updatedOrder);
    } catch (error) {
        console.error('Error archiving order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
