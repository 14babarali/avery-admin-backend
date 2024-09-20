
const bcrypt = require("bcrypt");
const { Order, Account, Customer } = require("../models");
const { generateRandomPassword } = require("../utils/generateRandomPassword");
const { sendEmail } = require("../utils/emailTrigger");




exports.webhook = async (req, res) => {
    try {
        const orderData = req.body;
        console.log('Processing order data:', orderData);

        const {
            id, // ID for order_id
            status,
            date_created,
            date_modified,
            billing: { first_name, last_name, email, phone, address_1, city, state, country, postcode },
            line_items,
        } = orderData;

        // Check if required fields exist
        if (!id || !line_items || line_items.length === 0 || !email) {
            return res.status(400).json({ error: 'Missing required order fields' });
        }

        // Calculate subtotal and total from line_items
        const subtotal = line_items.reduce((sum, item) => sum + parseFloat(item.subtotal), 0).toFixed(2);
        const total = line_items.reduce((sum, item) => sum + parseFloat(item.total), 0).toFixed(2);

        // Extract the order_name from the first line_item's name field
        const order_name = line_items.length > 0 ? line_items[0].name : '';

        // Format the line items for the database
        const formattedLineItems = line_items.map(item => ({
            product_id: item.product_id,
            name: item.name,
            quantity: item.quantity,
            subtotal: item.subtotal,
            total: item.total,
            price: item.price,
        }));

        // Check for an existing order by the ID (order_id)
        const existingOrder = await Order.findOne({ order_id: id });

        if (existingOrder) {
            // Update the existing order
            await Order.updateOne(
                { order_id: id },
                {
                    total,
                    subtotal,
                    date_created: new Date(date_created),
                    date_modified: new Date(date_modified),
                    status,
                    customer: { first_name, last_name, email },
                    phone,
                    order_name, // Use order_name to avoid conflict
                    line_items: formattedLineItems,
                }
            );
        } else {
            // Create a new order
            const newOrder = new Order({
                order_id: id,
                total,
                subtotal,
                date_created: new Date(date_created),
                date_modified: new Date(date_modified),
                status,
                customer: { first_name, last_name, email },
                phone,
                order_name, // Add the order name
                line_items: formattedLineItems,
            });

            await newOrder.save();
        }

        // If status is 'completed' or 'success', create customer and account
        if (status.toLowerCase() === 'completed' || status.toLowerCase() === 'success') {
            const randomPassword = generateRandomPassword();
            const hashedPassword = await bcrypt.hash(randomPassword, 10);

            // Create customer
            const newCustomer = new Customer({
                email,
                companyEmail: email,
                password: hashedPassword,
                active: true,
                firstName: first_name,
                lastName: last_name,
                phone,
                country,
                state,
                city,
                addressLine1: address_1,
                zip: postcode,
                status: "allow",
                language: "en",
                birthday: new Date(), // Placeholder
            });

            const savedCustomer = await newCustomer.save();

            // Create account
            const newAccount = new Account({
                displayName: `${first_name} ${last_name}`,
                customerEmail: email,
                companyEmail: email,
                plan: "null",
                type: "Phase1", // Adjust if needed
                accountUser: email,
                accountPassword: randomPassword,
                tradeSystem: "MT4",
            });

            await newAccount.save();

           // Send the email using the 'AccountCreated' template
           await sendEmail("AccountCreated", email, {
            first_name,
            email,
            password: randomPassword,
        });

        } else if (status.toLowerCase() === 'failed') {
            // Send the failure email using the 'OrderFailed' template
            await sendEmail("OrderFailed", email, {
                first_name,
                order_id: id,
            });
        }

        res.status(200).send('Webhook data processed and saved!');
    } catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).send('Error processing webhook data');
    }
};




exports.getOrders = async (req, res) => {
    try {
        // Fetch all orders from the database
        const orders = await Order.find({}); // Assuming `Order` is your Mongoose model

        // Send back the orders as a response
        res.status(200).json(orders);
    } catch (error) {
        // Handle errors (e.g., log them and send a 500 response)
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};




//Update status
exports.updateStatus = async (req, res) => {
    try {
        const { order_id } = req.params;
        const { status } = req.body;

        // Validate status
        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        // Find and update the order
        const order = await Order.findOneAndUpdate(
            { order_id },
            { $set: { status, date_modified: new Date() } }, // Update status and modify date
            { new: true, runValidators: true } // Return the updated document and validate
        );

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // If status is 'completed' or 'success', check for existing accounts
        if (status.toLowerCase() === 'completed' || status.toLowerCase() === 'success') {
            const email = order.customer.email; // Get the customer's email from the order

            // Check for existing customer
            const existingCustomer = await Customer.findOne({ email });
            const existingAccount = await Account.findOne({ customerEmail: email });

            if (!existingCustomer && !existingAccount) {
                const randomPassword = generateRandomPassword();
                const hashedPassword = await bcrypt.hash(randomPassword, 10);

                // Create customer
                const newCustomer = new Customer({
                    email,
                    companyEmail: email,
                    password: hashedPassword,
                    active: true,
                    firstName: order.customer.first_name,
                    lastName: order.customer.last_name,
                    phone: order.phone,
                    country: order.customer.country,
                    state: order.customer.state,
                    city: order.customer.city,
                    addressLine1: order.customer.addressLine1,
                    zip: order.customer.zip,
                    status: "allow",
                    language: "en",
                    birthday: new Date(), // Placeholder
                });

                await newCustomer.save();

                // Create account
                const newAccount = new Account({
                    displayName: `${order.customer.first_name} ${order.customer.last_name}`,
                    customerEmail: email,
                    companyEmail: email,
                    plan: "null",
                    type: "Phase1", // Adjust if needed
                    accountUser: email,
                    accountPassword: randomPassword,
                    tradeSystem: "MT4",
                });

                await newAccount.save();

                // Send the email using the 'AccountCreated' template
                await sendEmail("AccountCreated", email, {
                    first_name: order.customer.first_name,
                    email,
                    password: randomPassword,
                });
            }
        }

        res.status(200).json({ message: 'Order status updated', order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
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
