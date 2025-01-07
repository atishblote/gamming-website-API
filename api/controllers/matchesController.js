const Matches = require("../models/liveMaches");
const cache = require('../../config/cache');

exports.allViewMatches = async (req, res, next) => {
  const cacheKey = 'allMatches';
  const cachedData = cache.get(cacheKey);
  const limit = parseInt(req.query.limit) || 2;

  if (cachedData) {
    // If data is available in cache, return it
    return res.json({ data: cachedData, source: 'cache' });
  }

  try {

    const matches = await Matches.find()
      .limit(limit)
      .populate({
        path: "featured_id",
      });

    if (matches.length > 0) {
      // Cache the result for future requests
      cache.set(cacheKey, matches, 86400); // Cache for 1 hour (3600 seconds)

      res.status(200).json({
        code: true,
        data: matches,
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