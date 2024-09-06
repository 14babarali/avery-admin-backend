exports.thirdPartymiddleware = async (req, res, next) => {
    const requestIP = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const origin = req.headers.origin;
  
    if (origin === 'http://localhost:3002' || requestIP === "::ffff:127.0.0.1") {
      next();
    } else {
      return res.status(403).json({ message: "Banned IP Address" });
    }
  }