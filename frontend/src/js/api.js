// API Module
class API {
    constructor() {
        this.baseURL = 'http://localhost:3000/api';
    }

    // Generic API call method
    async call(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        // Add auth headers if authenticated
        if (auth.isAuthenticated()) {
            config.headers = { ...config.headers, ...auth.getAuthHeaders() };
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || `HTTP ${response.status}`);
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Health check
    async health() {
        return this.call('/health');
    }

    // System overview (Admin only)
    async getOverview() {
        return this.call('/admin/overview');
    }

    // Create booking
    async createBooking(bookingData) {
        return this.call('/bookings', {
            method: 'POST',
            body: JSON.stringify(bookingData)
        });
    }

    // Get all bookings
    async getAllBookings() {
        return this.call('/bookings');
    }

    // Get booking by ID
    async getBooking(bookingId) {
        return this.call(`/bookings/${bookingId}`);
    }

    // Assign bracelet
    async assignBracelet(bookingId, braceletId) {
        return this.call('/bracelets/assign', {
            method: 'POST',
            body: JSON.stringify({ booking_id: bookingId, bracelet_id: braceletId })
        });
    }

    // Verify bracelet
    async verifyBracelet(braceletId, gateNo) {
        return this.call('/bracelets/verify', {
            method: 'POST',
            body: JSON.stringify({ bracelet_id: braceletId, gate_no: gateNo })
        });
    }

    // Get bracelet status
    async getBraceletStatus(braceletId) {
        return this.call(`/bracelets/${braceletId}/status`);
    }

    // Manual bracelet sync
    async syncBracelet(braceletId) {
        return this.call(`/bracelets/${braceletId}/sync`, {
            method: 'PUT'
        });
    }

    // Deactivate bracelet
    async deactivateBracelet(braceletId) {
        return this.call(`/bracelets/${braceletId}/deactivate`, {
            method: 'POST'
        });
    }

    // Get sync logs
    async getSyncLogs(filter = 'all') {
        return this.call(`/admin/sync_logs?filter=${filter}`);
    }

    // Force manual sync
    async forceSync() {
        return this.call('/sync/force', {
            method: 'POST'
        });
    }

    // Get all bracelets with status
    async getAllBracelets() {
        return this.call('/bracelets');
    }

    // Get all passengers
    async getAllPassengers() {
        return this.call('/passengers');
    }

    // Get all flights
    async getAllFlights() {
        return this.call('/flights');
    }
}

// Export API instance
const api = new API();