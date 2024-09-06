exports.thirdPartymiddleware = async (req, res, next) => {
    if (req.url === '/webhooks/woocommerce') {
      return next(); // Bypass IP check for webhook endpoint
    }
  
    const requestIP = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (requestIP !== "::ffff:127.0.0.1") {
      return res.status(403).json({ message: "Banned IP Address" });
    }
    next();
  }