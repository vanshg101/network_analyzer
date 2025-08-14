import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom icon based on measurement
const createDetailedIcon = (measurement) => {
  const speed = measurement.downloadMbps || 0;
  const ping = measurement.pingMs || 0;
  const accuracy = measurement.locationMetadata?.gpsAccuracy || 1000;

  let speedColor = "#6b7280";
  if (speed >= 100) speedColor = "#10b981";
  else if (speed >= 50) speedColor = "#22c55e";
  else if (speed >= 25) speedColor = "#eab308";
  else if (speed >= 10) speedColor = "#f97316";
  else if (speed >= 1) speedColor = "#ef4444";

  let pingColor = "#10b981";
  if (ping > 100) pingColor = "#ef4444";
  else if (ping > 50) pingColor = "#f97316";
  else if (ping > 20) pingColor = "#eab308";

  const size =
    accuracy <= 50 ? 28 : accuracy <= 100 ? 24 : accuracy <= 500 ? 20 : 16;

  return L.divIcon({
    html: `
      <div style="
        background: linear-gradient(45deg, ${speedColor} 50%, ${pingColor} 50%);
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 3px 6px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        color: white;
        font-weight: bold;
        position: relative;
      ">
        ${Math.round(speed)}
      </div>
    `,
    className: "custom-detailed-icon",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// Detailed popup
const DetailedPopup = ({ measurement }) => {
  const props = measurement.properties;
  const coords = measurement.geometry.coordinates;
  const metadata = props.locationMetadata || {};

  return (
    <div className="p-3 min-w-80 max-w-96">
      {/* Header */}
      <div className="border-b pb-2 mb-3">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-bold text-lg text-green-600">
              {props.downloadMbps
                ? `${props.downloadMbps} Mbps`
                : "No Speed Data"}
            </div>
            <div className="text-sm text-gray-600">
              {new Date(props.createdAt).toLocaleString()}
            </div>
          </div>
          <div className="text-right">
            <div className="font-medium text-blue-600">
              {props.pingMs || "N/A"} ms
            </div>
            <div className="text-xs text-gray-500">ping</div>
          </div>
        </div>
      </div>

      {/* Network Info */}
      <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
        <div>
          <div className="font-medium text-gray-700">Provider</div>
          <div className="text-gray-900">{props.provider || "Unknown"}</div>
        </div>
        <div>
          <div className="font-medium text-gray-700">Network Type</div>
          <div className="text-gray-900">{props.networkType || "Unknown"}</div>
        </div>
      </div>

      {/* Location Info */}
      <div className="mb-3">
        <div className="font-medium text-gray-700 mb-1">
          📍 Location Details
        </div>
        <div className="text-sm space-y-1">
          <div>
            <strong>Method:</strong> {props.locationRemark || "Unknown"}
          </div>
          <div>
            <strong>Coordinates:</strong>{" "}
            {coords[1].toFixed(6)}, {coords[0].toFixed(6)}
          </div>
          {metadata.gpsAccuracy && (
            <div>
              <strong>GPS Accuracy:</strong> ±
              {Math.round(metadata.gpsAccuracy)}m
            </div>
          )}
          <div>
            <strong>Source:</strong> {metadata.locationSource || "Unknown"}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="p-2 bg-gray-100 rounded">
          <div className="font-medium">Download</div>
          <div>
            {props.downloadMbps ? `${props.downloadMbps} Mbps` : "N/A"}
          </div>
        </div>
        <div className="p-2 bg-gray-100 rounded">
          <div className="font-medium">Upload</div>
          <div>
            {props.uploadMbps ? `${props.uploadMbps} Mbps` : "N/A"}
          </div>
        </div>
        <div className="p-2 bg-gray-100 rounded">
          <div className="font-medium">Ping</div>
          <div>{props.pingMs ? `${props.pingMs} ms` : "N/A"}</div>
        </div>
        <div className="p-2 bg-gray-100 rounded">
          <div className="font-medium">Jitter</div>
          <div>{props.jitterMs ? `${props.jitterMs} ms` : "N/A"}</div>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [measurements, setMeasurements] = useState([]);

  // Fetch measurements from backend
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/measurements")
      .then((res) => {
        setMeasurements(res.data);
      })
      .catch((err) => {
        console.error("Error fetching measurements:", err);
      });
  }, []);

  // Function to send measurement
  const sendData = async (measurement) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/measurements",
        measurement
      );
      console.log("Saved:", res.data);
    } catch (err) {
      console.error("Error saving measurement:", err);
    }
  };

  return (
    <div className="h-screen w-screen">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {measurements.map((m, idx) => (
          <Marker
            key={idx}
            position={[m.geometry.coordinates[1], m.geometry.coordinates[0]]}
            icon={createDetailedIcon(m.properties)}
          >
            <Popup>
              <DetailedPopup measurement={m} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
