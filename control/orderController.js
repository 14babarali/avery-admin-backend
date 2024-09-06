
const { Order } = require("../models");



exports.webhook = async (req, res) => {
    try {
        const orderData = req.body;
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
    try {
        // Find the order by ID and mark it as archived
        const archivedOrder = await Order.findByIdAndUpdate(req.params.id, { archived: true }, { new: true });
        
        if (!archivedOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json({ message: 'Order archived successfully', order: archivedOrder });
    } catch (error) {
        res.status(500).json({ error: 'Error archiving order' });
    }
};
