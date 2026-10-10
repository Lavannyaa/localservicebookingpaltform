const Service = require('../models/Service');
const Category = require('../models/Category');
const Provider = require('../models/Provider');
const { calculateDistanceKm } = require('../utils/distance');
const { isProviderEligible } = require('../utils/providerEligibility');

/**
 * Get all services with multi-criteria search, distance & proximity filtering
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
      lat,
      lng,
      maxDistanceKm,
      radius,
      page = 1,
      limit = 100,
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
    if (category && category !== 'All' && category !== 'all') {
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

    const rawServices = await Service.find(query);
    const providers = await Provider.find({ availabilityStatus: 'AVAILABLE' });

    // Customer coordinates (default to Tirunelveli center if unprovided)
    const custLat = !isNaN(parseFloat(lat)) ? parseFloat(lat) : 8.7139;
    const custLng = !isNaN(parseFloat(lng)) ? parseFloat(lng) : 77.7567;

    // Attach Haversine distance & closest eligible provider to each service
    let mapped = rawServices.map((srv) => {
      const srvObj = srv.toObject();

      // Find providers strictly eligible for this service category/trade
      const matchingProviders = providers.filter((p) => isProviderEligible(p, srv));

      let minDistance = Infinity;
      let closestProvider = null;

      if (matchingProviders.length > 0) {
        matchingProviders.forEach((p) => {
          if (p.latitude && p.longitude) {
            const d = calculateDistanceKm(custLat, custLng, p.latitude, p.longitude);
            if (d !== null && d < minDistance) {
              minDistance = d;
              closestProvider = p;
            }
          }
        });
        if (minDistance === Infinity) {
          minDistance = 1.1;
          closestProvider = matchingProviders[0];
        }
      }

      return {
        ...srvObj,
        _id: srv._id,
        serviceId: srv.serviceId || srv._id.toString(),
        serviceName: srv.name,
        name: srv.name,
        startingPrice: srv.startingPrice,
        basePrice: srv.startingPrice,
        description: srv.description,
        category: srv.category,
        rating: srv.rating,
        reviewCount: srv.reviewCount,
        estimatedDuration: srv.estimatedDuration,
        distanceKm: closestProvider ? minDistance : null,
        providerId: closestProvider ? (closestProvider.providerId || closestProvider._id.toString()) : null,
        providerName: closestProvider ? (closestProvider.shopName || closestProvider.providerName) : null,
        location: closestProvider ? closestProvider.city : srv.location || 'Tirunelveli',
        availability: srv.availability ? 'Available' : 'Busy',
      };
    });

    // Distance Radius Filtering (2 km, 5 km, 10 km, 25 km)
    const effectiveRadius = maxDistanceKm || radius;
    if (effectiveRadius && effectiveRadius !== 'all') {
      const limitKm = Number(effectiveRadius);
      if (!isNaN(limitKm)) {
        mapped = mapped.filter((item) => item.distanceKm <= limitKm);
      }
    }

    // Sort Order
    const sortKey = sort || 'popular';
    if (sortKey === 'nearest') {
      mapped.sort((a, b) => a.distanceKm - b.distanceKm);
    } else if (sortKey === 'price_asc' || sortKey === 'price-low') {
      mapped.sort((a, b) => a.startingPrice - b.startingPrice);
    } else if (sortKey === 'price_desc' || sortKey === 'price-high') {
      mapped.sort((a, b) => b.startingPrice - a.startingPrice);
    } else if (sortKey === 'rating_desc' || sortKey === 'rating') {
      mapped.sort((a, b) => b.rating - a.rating);
    } else if (sortKey === 'name_asc' || sortKey === 'name') {
      mapped.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Popular (review count)
      mapped.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const paginated = mapped.slice(skip, skip + Number(limit));

    res.status(200).json({
      success: true,
      count: paginated.length,
      total: mapped.length,
      page: Number(page),
      pages: Math.ceil(mapped.length / Number(limit)),
      data: paginated,
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

    // Find verified providers strictly eligible for this service category or trade
    const allProviders = await Provider.find({ availabilityStatus: 'AVAILABLE' });
    const matchingProviders = allProviders.filter((p) => isProviderEligible(p, service));
    const primaryProvider = matchingProviders[0] || null;

    res.status(200).json({
      success: true,
      data: {
        ...service.toObject(),
        serviceId: service.serviceId || service._id.toString(),
        serviceName: service.name,
        startingPrice: service.startingPrice,
        basePrice: service.startingPrice,
        providerId: primaryProvider ? (primaryProvider.providerId || primaryProvider._id.toString()) : null,
        providerName: primaryProvider ? (primaryProvider.shopName || primaryProvider.providerName) : null,
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
