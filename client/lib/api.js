export class ApiClient {
  constructor() {
    this.baseUrl = "http://localhost:8000/api/v1"
  }

  async sendSpeedTestData(data) {
    try {
      const response = await fetch(`${this.baseUrl}/sendData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to send data")
      }

      return result
    } catch (error) {
      console.error("API Error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  }

  async getAggregatedData() {
    try {
      const response = await fetch(`${this.baseUrl}/aggregated`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch data")
      }

      return result
    } catch (error) {
      console.error("API Error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  }

  async getPublicIP() {
    try {
      const response = await fetch("https://api.ipify.org?format=json")
      const data = await response.json()
      return data.ip
    } catch (error) {
      console.error("Failed to fetch IP:", error)
      return "192.168.1.10" // fallback
    }
  }

  async reverseGeocode(lat, lon) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`,
      )
      const data = await response.json()

      if (data && data.display_name) {
        return data.display_name
      }

      return `${lat.toFixed(4)}, ${lon.toFixed(4)}`
    } catch (error) {
      console.error("Reverse geocoding failed:", error)
      return `${lat.toFixed(4)}, ${lon.toFixed(4)}`
    }
  }
}

export const apiClient = new ApiClient()
