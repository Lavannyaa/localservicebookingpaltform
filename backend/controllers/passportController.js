const ServicePassport = require('../models/ServicePassport');

/**
 * Get service passports for the authenticated user
 * GET /api/service-passport
 */
const getServicePassports = async (req, res, next) => {
  try {
    const filter = req.user.role === 'ADMIN' && req.query.customerId
      ? { customerId: req.query.customerId }
      : { customerId: req.user._id };

    const passports = await ServicePassport.find(filter)
      .populate('customerId', 'name email phone')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: passports.length,
      data: passports,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get single service passport by ID or passport number
 * GET /api/service-passport/:id
 */
const getServicePassportById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const passport = await ServicePassport.findOne({
      $or: [{ passportNumber: id }, ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : [])],
    }).populate('customerId', 'name email phone');

    if (!passport) {
      return res.status(404).json({
        success: false,
        message: 'Service Passport not found.',
      });
    }

    if (
      req.user.role === 'CUSTOMER' &&
      passport.customerId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only view your own Service Passport.',
      });
    }

    res.status(200).json({
      success: true,
      data: passport,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getServicePassports,
  getServicePassportById,
};
