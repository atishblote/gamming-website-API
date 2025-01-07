const Promotions = require("../models/promotionModel");
const cache = require('../../config/cache');

exports.allViewPromotion = async (req, res, next) => {
  const cacheKey = 'allPromotions';
  const cachedData = cache.get(cacheKey);
  const limit = parseInt(req.query.limit) || 2;

  if (cachedData) {
    // If data is available in cache, return it
    return res.json({ data: cachedData, source: 'cache' });
  }

  try {

    const promotions = await Promotions.find()
      .limit(limit)
      .populate({
        path: "featured_id",
      });

    if (promotions.length > 0) {
      // Cache the result for future requests
      cache.set(cacheKey, promotions, 86400); // Cache for 1 hour (3600 seconds)

      res.status(200).json({
        code: true,
        data: promotions,
        message: 'Successful'
      });
    } else {
      res.status(401).json({
        code: false,
        message: "Data not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      code: false,
      message: "Something went wrong",
      error: error,
    });
  }
};