const Service = require('../models/Service');
const Category = require('../models/Category');
const Provider = require('../models/Provider');

/**
 * Get all services with multi-criteria search & filtering
 * GET /api/services
 */
const getServices = async (req, res, next) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      minRating,
      availableOnly,
      providerId,
      sort,
      page = 1,
      limit = 50,
    } = req.query;

    const query = {};

    // Search by text query
    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { category: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(`^${category.trim()}$`, 'i') };
    }

    // Price range filtering
    if (minPrice || maxPrice) {
      query.startingPrice = {};
      if (minPrice) query.startingPrice.$gte = Number(minPrice);
      if (maxPrice) query.startingPrice.$lte = Number(maxPrice);
    }

    // Rating filtering
    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    // Availability filter
    if (availableOnly === 'true') {
      query.availability = true;
    }

    // Sort order
    let sortOption = { rating: -1, reviewCount: -1 };
    if (sort === 'price_asc') sortOption = { startingPrice: 1 };
    if (sort === 'price_desc') sortOption = { startingPrice: -1 };
    if (sort === 'rating_desc') sortOption = { rating: -1 };
    if (sort === 'name_asc') sortOption = { name: 1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Service.countDocuments(query);
    const services = await Service.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: services.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: services,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get single service by ID
 * GET /api/services/:id
 */
const getServiceById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Support both MongoDB _id and serviceId (e.g. SRV-AC-01)
    const service = await Service.findOne({
      $or: [{ serviceId: id }, ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : [])],
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found in platform catalogue.',
      });
    }

    // Find verified providers offering this service or category in Tirunelveli
    const matchingProviders = await Provider.find({
      $or: [
        { servicesOffered: service._id },
        { specialization: { $in: [service.category, service.name] } },
      ],
      availabilityStatus: 'AVAILABLE',
    }).limit(6);

    res.status(200).json({
      success: true,
      data: {
        ...service.toObject(),
        nearbyProviders: matchingProviders,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Create new service (Admin only)
 * POST /api/services
 */
const createService = async (req, res, next) => {
  try {
    const {
      name,
      category,
      description,
      startingPrice,
      estimatedDuration,
      defaultChecklist,
      recommendedMaintenanceIntervalMonths,
    } = req.body;

    if (!name || !category || !description || !startingPrice) {
      return res.status(422).json({
        success: false,
        message: 'Name, category, description, and starting price are required.',
      });
    }

    const serviceId = `SRV-${Date.now().toString().slice(-6)}`;

    const newService = await Service.create({
      serviceId,
      name,
      category,
      description,
      startingPrice: Number(startingPrice),
      estimatedDuration: estimatedDuration || '60 mins',
      defaultChecklist: defaultChecklist || [],
      recommendedMaintenanceIntervalMonths: Number(recommendedMaintenanceIntervalMonths) || 3,
    });

    // Update category service count
    await Category.findOneAndUpdate(
      { name: category },
      { $inc: { serviceCount: 1 } }
    );

    res.status(201).json({
      success: true,
      message: 'Service added successfully to platform catalogue.',
      data: newService,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update service (Admin only)
 * PUT /api/services/:id
 */
const updateService = async (req, res, next) => {
  try {
    const { id } = req.params;

    const service = await Service.findOneAndUpdate(
      { $or: [{ serviceId: id }, ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : [])] },
      req.body,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found to update.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service updated successfully.',
      data: service,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete service (Admin only)
 * DELETE /api/services/:id
 */
const deleteService = async (req, res, next) => {
  try {
    const { id } = req.params;

    const service = await Service.findOneAndDelete({
      $or: [{ serviceId: id }, ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : [])],
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found to delete.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service deleted from platform catalogue.',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all categories
 * GET /api/categories
 */
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getCategories,
};
