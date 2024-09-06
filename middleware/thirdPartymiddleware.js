exports.thirdPartymiddleware = async (req, res, next) => {
    // Bypass IP check for the webhook endpoint
    if (req.url === '/webhooks/woocommerce') {
        return next();
    }
  
    // Allow requests from all IP addresses
    next();
};
