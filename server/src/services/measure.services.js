// src/services/measure.services.js
import fetch from "node-fetch"; // For Node < 18
import { ApiError } from "../utils/ApiError.js";
import { Measurement } from "../models/measure.model.js";

async function getLocationFromIp(ip) {
    try {
        const res = await fetch(`https://ipapi.co/${ip}/json/`);
        if (!res.ok) {
            throw new Error(`IP API failed: ${res.statusText}`);
        }
        const data = await res.json();
        if (!data.latitude || !data.longitude) {
            throw new Error("No lat/lon from IP API");
        }
        return {
            latitude: data.latitude,
            longitude: data.longitude,
            ipInfo: data // full response saved
        };
    } catch (err) {
        console.error("IP location fetch error:", err.message);
        return null;
    }
}

export const saveMeasurement = async (measurementData, clientIp) => {
    // 1. Required speed test fields
    if (!measurementData.downloadMbps || !measurementData.uploadMbps || !measurementData.provider) {
        throw new ApiError(400, "Missing required fields: downloadMbps, uploadMbps, provider");
    }

    let latitude = measurementData.latitude;
    let longitude = measurementData.longitude;
    let ipInfo = measurementData.ipInfo || null;

    // 2. If no lat/lon, try IP lookup
    
        const locData = await getLocationFromIp(clientIp);
        if (locData) {
            latitude = locData.latitude;
            longitude = locData.longitude;
            ipInfo = locData.ipInfo;
        }
    

    if (!latitude || !longitude) {
        throw new ApiError(400, "Unable to determine location");
    }

    // 3. Build Mongo document
    const finalData = {
        location: {
            type: "Point",
            coordinates: [longitude, latitude], // GeoJSON: [lng, lat]
        },
        provider: measurementData.provider,
        networkType: measurementData.networkType || null,
        downloadMbps: measurementData.downloadMbps,
        uploadMbps: measurementData.uploadMbps,
        pingMs: measurementData.pingMs || null,
        jitterMs: measurementData.jitterMs || null,
        signalStrength: measurementData.signalStrength || null,
        locationRemark: measurementData.locationRemark || null,
        cells: measurementData.cells || [],
        wifis: measurementData.wifis || [],
        ipInfo,
        mlsResult: null,
    };

    // 4. Save to DB
    try {
        const saved = await Measurement.create(finalData);
        return saved;
    } catch (err) {
        console.error("DB save error:", err);
        throw new ApiError(500, "Database save failed", [err.message]);
    }
};

export const getMeasurementsGeoJSON = async () => {
    try {
        const measurements = await Measurement.find({ location: { $ne: null } });

        return {
            type: "FeatureCollection",
            features: measurements.map(m => ({
                type: "Feature",
                geometry: m.location,
                properties: {
                    provider: m.provider,
                    networkType: m.networkType,
                    downloadMbps: m.downloadMbps,
                    uploadMbps: m.uploadMbps,
                    pingMs: m.pingMs,
                    jitterMs: m.jitterMs,
                    signalStrength: m.signalStrength,
                    locationRemark: m.locationRemark,
                    createdAt: m.createdAt
                }
            }))
        };
    } catch (err) {
        console.error("Error fetching measurements:", err);
        throw new ApiError(500, "Failed to fetch measurements", [err.message]);
    }
};