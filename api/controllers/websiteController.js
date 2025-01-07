const Websites = require("../models/websiteModel");
const cache = require('../../config/cache');

exports.allwebsites = async (req, res, next) => {
  const cacheKey = 'allWebsites';
  const cachedData = cache.get(cacheKey);
  const limit = parseInt(req.query.limit) || 4;

  if (cachedData) {
    // If data is available in cache, return it
    return res.json({ data: cachedData, source: 'cache' });
  }

  try {

    const website = await Websites.find()
      .limit(limit)
      .populate({
        path: "logo_url",
      });

    if (website.length > 0) {
      // Cache the result for future requests
      cache.set(cacheKey, website, 86400); // Cache for 1 hour (3600 seconds)

      res.status(200).json({
        code: true,
        data: website,
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