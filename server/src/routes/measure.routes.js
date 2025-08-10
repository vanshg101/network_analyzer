import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { saveMeasurement, getMeasurementsGeoJSON } from "../services/measure.services.js";

const router = express.Router();

// POST: Save measurement
router.post("/", asyncHandler(async (req, res) => {
    const saved = await saveMeasurement(req.body);
    res.status(201).json({ success: true, data: saved });
}));

// GET: Get all measurements (GeoJSON for map)
router.get("/", asyncHandler(async (req, res) => {
    const geoData = await getMeasurementsGeoJSON();
    res.json(geoData);
}));

export default router;
