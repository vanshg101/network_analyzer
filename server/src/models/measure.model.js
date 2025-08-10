import mongoose, { Schema } from "mongoose";
  
const MeasurementSchema = new Schema({
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], index: "2dsphere" }, // [lng, lat]
  },
  provider: String, // Airtel, Jio, etc.
  networkType: String, // 4G, 5G, WiFi, etc.
  downloadMbps: Number,
  uploadMbps: Number,
  pingMs: Number,
  jitterMs: Number,
  signalStrength: Number, // dBm
  locationRemark: String, // <-- NEW: user/system remark for location
  cells: [Object], // raw cell tower data
  wifis: [Object], // raw wifi data
  ipInfo: Object, // IP geolocation fallback
  mlsResult: Object, // full MLS response
},{
    timestamps:true
});

export const Measurement =mongoose.model("Measurement",MeasurementSchema)
