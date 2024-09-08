
const { Order, Account } = require("../models");
const { generateRandomPassword } = require("../utils/generateRandomPassword");
const { sendEmail } = require("../utils/emailTrigger");




exports.webhook = async (req, res) => {
    try {
        const orderData = req.body;
        console.log('Processing order data:', orderData);

        // Extract the order number from the incoming data
        const { number } = orderData;

        // Check for an existing order using the number
        const existingOrder = await Order.findOne({ number });
        
        if (existingOrder) {
            // Update the existing order with new data
            await Order.updateOne({ number }, orderData);
        } else {
            // Create a new order with the incoming data
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






exports.updateOrder = async function updateOrder(req, res) {
    try {
        const { email, phone, plan, number, first_name, last_name } = req.body; // Use `number` instead of `orderKey`

        // Check if an account exists for the given email
        let account = await Account.findOne({ customerEmail: email });

        if (!account) {
            const generatedPassword = generateRandomPassword();
            account = new Account({
                displayName: `${first_name} ${last_name}`,
                customerEmail: email,
                companyEmail: email,
                plan: plan,
                leverage: 10,
                tradeSystem: 'MT4',
                accountUser: email,
                accountPassword: bcrypt.hashSync(generatedPassword, 10),
            });

            await account.save();

            await sendEmail("AccountCreation", email, {
                name: account.displayName,
                email: account.customerEmail,
                password: generatedPassword,
            });
        }

        // Update or create the order based on number
        const order = await Order.findOneAndUpdate(
            { order_key: number }, // Match the schema field name with webhook payload
            { phone, plan, account: account._id },
            { new: true, upsert: true }
        );

        res.status(200).send({ message: 'Order updated successfully', order });
    } catch (err) {
        console.error("Error updating order:", err);
        res.status(500).send({ error: 'Error updating order' });
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
