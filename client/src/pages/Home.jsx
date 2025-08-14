// src/pages/Home.jsx
import React, { useState } from "react";

const Home = () => {
  const [downloadSpeed, setDownloadSpeed] = useState(null);
  const [uploadSpeed, setUploadSpeed] = useState(null);
  const [ping, setPing] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Get public IP
  const getPublicIP = async () => {
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();
      return data.ip;
    } catch {
      return null;
    }
  };

  // Get GPS location
  const getGPSLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) return reject("Geolocation not supported");

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (err) => reject(err),
        { timeout: 10000 } // Removed enableHighAccuracy for better desktop support
      );
    });
  };

  // Fallback IP-based location
  const getIPLocation = async () => {
    try {
      const res = await fetch("https://ipapi.co/json");
      const data = await res.json();
      return { latitude: data.latitude, longitude: data.longitude };
    } catch {
      return null;
    }
  };

  // Run speed test
  const runSpeedTest = async () => {
    setLoading(true);
    try {
      // Fake speed test (replace with real library if needed)
      const download = (Math.random() * 100).toFixed(2);
      const upload = (Math.random() * 50).toFixed(2);
      const pingValue = (Math.random() * 50).toFixed(0);

      setDownloadSpeed(download);
      setUploadSpeed(upload);
      setPing(pingValue);

      // Get location (GPS first, fallback to IP)
      let gps = await getGPSLocation().catch(() => null);
      if (!gps) gps = await getIPLocation();
      setLocation(gps);

      const ip = await getPublicIP();

      const payload = {
        downloadSpeed: parseFloat(download),
        uploadSpeed: parseFloat(upload),
        ping: parseInt(pingValue),
        ip,
        latitude: gps?.latitude,
        longitude: gps?.longitude,
      };

      // Send to backend
      const response = await fetch("/api/v1/sendData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Error running speed test:", err);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Network Speed Test</h1>
      <button onClick={runSpeedTest} disabled={loading}>
        {loading ? "Testing..." : "Run Speed Test"}
      </button>

      {downloadSpeed && uploadSpeed && ping && (
        <div style={{ marginTop: "1rem" }}>
          <p>Download Speed: {downloadSpeed} Mbps</p>
          <p>Upload Speed: {uploadSpeed} Mbps</p>
          <p>Ping: {ping} ms</p>
        </div>
      )}

      {location && (
        <div>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
        </div>
      )}

      {result && (
        <div style={{ marginTop: "1rem", borderTop: "1px solid #ccc", paddingTop: "1rem" }}>
          <h2>Saved Result</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Home;
