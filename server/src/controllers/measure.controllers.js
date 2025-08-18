import { SpeedTest } from '../models/measure.model.js';
import { ApiError } from '../utils/ApiError.js';

// Save speed test entry
const sendData = async (req, res) => {
  const { downloadSpeed, uploadSpeed, ping, ip, latitude, longitude } = req.body;

  if (!downloadSpeed || !uploadSpeed || !ping) {
    throw new ApiError(400, "Missing required fields");
  }

    const entry = new SpeedTest({
      ip: ip || "Unknown",
      provider: ip || "Unknown",
      latitude: latitude || null,
      longitude: longitude || null,
      downloadSpeedMbps: downloadSpeed,
      uploadSpeedMbps: uploadSpeed,
      pingMs: ping,
    });

  await entry.save();
  res.json({ success: true, data: entry });
};

// Get the latest speed test measurement
const getData = async (req, res) => {
  const latestEntry = await SpeedTest.findOne().sort({ timestamp: -1 }); // latest

  if (!latestEntry) {
    throw new ApiError(404, "No speed test data found");
  }

  res.json({ success: true, data: latestEntry });
};

export { sendData, getData };
