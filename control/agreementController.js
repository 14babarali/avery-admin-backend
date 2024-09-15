const { Agreement } = require('../models');

// Create a new agreement
exports.createAgreement = async (req, res) => {
    const { agreementURL, version } = req.body;
  
    try {
      // Check if the version already exists
      const existingAgreement = await Agreement.findOne({ version });
  
      if (existingAgreement) {
        return res.status(400).json({ message: 'This version already exists. Please use a new version.' });
      }
  
      // Create a new agreement if the version doesn't exist
      const newAgreement = new Agreement({ agreementURL, version });
      await newAgreement.save();
      res.status(201).json({ message: 'Agreement saved successfully' });
  
    } catch (error) {
      console.error('Error saving agreement:', error);
      res.status(500).json({ message: 'Failed to save agreement', error });
    }
  };


