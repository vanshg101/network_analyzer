import { SpeedTest } from "../models/measure.model.js";

export const aggregateSpeedData = async (req, res) => {
  try {
    const results = await SpeedTest.aggregate([
      {
        $addFields: {
          latBucket: { $round: ["$latitude", 1] }, // ~0.5–1 km grid
          lonBucket: { $round: ["$longitude", 1] },
          date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          hour: { $hour: "$timestamp" }
        }
      },
      {
        $group: {
          _id: {
            provider: "$provider",
            latBucket: "$latBucket",
            lonBucket: "$lonBucket",
            date: "$date",
            hour: "$hour"
          },
          totalTests: { $sum: 1 },
          avgDownload: { $avg: "$downloadSpeedMbps" },
          avgUpload: { $avg: "$uploadSpeedMbps" },
          maxDownload: { $max: "$downloadSpeedMbps" },
          minDownload: { $min: "$downloadSpeedMbps" },
          maxUpload: { $max: "$uploadSpeedMbps" },
          minUpload: { $min: "$uploadSpeedMbps" }
        }
      },
      {
        $project: {
          _id: 0,
          provider: "$_id.provider",
          location: {
            latBucket: "$_id.latBucket",
            lonBucket: "$_id.lonBucket"
          },
          timeBucket: {
            date: "$_id.date",
            hour: "$_id.hour"
          },
          metrics: {
            totalTests: "$totalTests",
            avgDownload: { $round: ["$avgDownload", 2] },
            avgUpload: { $round: ["$avgUpload", 2] },
            maxDownload: "$maxDownload",
            minDownload: "$minDownload",
            maxUpload: "$maxUpload",
            minUpload: "$minUpload"
          },
          lastUpdated: new Date()
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: results
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
