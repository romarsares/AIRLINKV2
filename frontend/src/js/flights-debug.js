// Debug version of flights.js with console logging

class FlightManager {
    constructor() {
        this.apiBase = 'http://localhost:3000/api';
        this.availableGates = [];
        console.log('FlightManager initialized');
        this.init();
    }

    init() {
        console.log('FlightManager init called');
        this.loadGates();
        this.loadFlights();
        this.setupEventListeners();
        setInterval(() => this.loadFlights(), 30000);
    }

    async loadGates() {
        try {
            const response = await fetch(`${this.apiBase}/gates`);
            const data = await response.json();
            
            if (Array.isArray(data)) {
                this.availableGates = data.map(g => g.gate_no || g.gate_name || g);
            } else if (data.gates) {
                this.availableGates = data.gates.map(g => g.gate_no || g.gate_name || g);
            } else {
                // Fallback to default gates
                this.availableGates = ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9', 'G10'];
            }
            console.log('Available gates loaded:', this.availableGates);
        } catch (error) {
            console.error('Failed to load gates, using defaults:', error);
            this.availableGates = ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9', 'G10'];
        }
    }

    setupEventListeners() {
        const statusSelect = document.getElementById('flightStatus');
        if (statusSelect) {
            statusSelect.addEventListener('change', (e) => {
                const status = e.target.value;
                document.getElementById('delayGroup').style.display = 
                    status === 'Delayed' ? 'block' : 'none';
                document.getElementById('reasonGroup').style.display = 
                    ['Delayed', 'Cancelled'].includes(status) ? 'block' : 'none';
            });
        }

        const form = document.getElementById('gateChangeForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateFlight();
            });
        }
        
        const closeBtn = document.getElementById('closeModalBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeGateModal());
        }
    }

    async loadFlights() {
        console.log('Loading flights from API...');
        try {
            const response = await fetch(`${this.apiBase}/flights`);
            console.log('API Response status:', response.status);
            
            const data = await response.json();
            console.log('API Response data:', data);
            
            // Handle both response formats
            let flights = [];
            if (Array.isArray(data)) {
                flights = data;
            } else if (data.success && data.flights) {
                flights = data.flights;
            } else if (data.flights) {
                flights = data.flights;
            }
            
            if (flights.length > 0) {
                console.log('Flights loaded:', flights.length);
                this.displayFlights(flights);
            } else {
                console.error('No flights in response');
                document.getElementById('flightsTableBody').innerHTML = 
                    '<tr><td colspan="7" style="text-align:center;">No flights available</td></tr>';
            }
        } catch (error) {
            console.error('Failed to load flights:', error);
        }
    }

    displayFlights(flights) {
        console.log('Displaying flights:', flights);
        const tbody = document.getElementById('flightsTableBody');
        
        if (!tbody) {
            console.error('flightsTableBody not found!');
            return;
        }

        if (!flights || flights.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No flights found</td></tr>';
            return;
        }

        const rows = flights.map((flight, index) => {
            console.log(`Creating row ${index} for flight:`, flight);
            
            return `
                <tr>
                    <td><strong>${flight.flight_no || 'N/A'}</strong></td>
                    <td>${flight.destination || 'N/A'}</td>
                    <td><span class="gate-badge">${flight.gate_no || 'N/A'}</span></td>
                    <td>${this.formatTime(flight.departure_time)}</td>
                    <td><span class="status-badge ${(flight.status || 'scheduled').toLowerCase()}">${flight.status || 'Scheduled'}</span></td>
                    <td>${flight.total_passengers || flight.passenger_count || 0}</td>
                    <td>
                        <button class="btn-small flight-update-btn" 
                                data-flight-id="${flight.flight_id}"
                                data-flight-no="${flight.flight_no}"
                                data-gate="${flight.gate_no}"
                                data-status="${flight.status}">Update</button>
                    </td>
                </tr>
            `;
        }).join('');

        console.log('Setting tbody HTML');
        tbody.innerHTML = rows;
        
        // Add event listeners to all update buttons
        tbody.querySelectorAll('.flight-update-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const flightId = e.target.dataset.flightId;
                const flightNo = e.target.dataset.flightNo;
                const gate = e.target.dataset.gate;
                const status = e.target.dataset.status;
                console.log('Button clicked:', flightId, flightNo, gate, status);
                this.openGateModal(flightId, flightNo, gate, status);
            });
        });
        
        console.log('Flights displayed successfully');
    }

    openGateModal(flightId, flightNo, currentGate, currentStatus) {
        console.log('openGateModal called:', flightId, flightNo, currentGate, currentStatus);
        
        const modal = document.getElementById('gateChangeModal');
        if (!modal) {
            console.error('Modal not found!');
            alert('Error: Modal not found!');
            return;
        }
        
        document.getElementById('flightId').value = flightId;
        document.getElementById('flightNumber').value = flightNo;
        
        // Populate gate dropdown with current gate first
        const gateSelect = document.getElementById('newGate');
        
        gateSelect.innerHTML = `<option value="${currentGate}">${currentGate} (Current)</option>`;
        this.availableGates.forEach(gate => {
            if (gate !== currentGate) {
                gateSelect.innerHTML += `<option value="${gate}">Gate ${gate}</option>`;
            }
        });
        
        gateSelect.value = currentGate;
        document.getElementById('flightStatus').value = currentStatus;
        
        document.getElementById('delayGroup').style.display = 'none';
        document.getElementById('reasonGroup').style.display = 'none';
        
        modal.style.display = 'flex';
        console.log('Modal opened');
    }

    async updateFlight() {
        const flightId = document.getElementById('flightId').value;
        const newGate = document.getElementById('newGate').value.trim();
        const status = document.getElementById('flightStatus').value;
        const delayMinutes = document.getElementById('delayMinutes').value;
        const reason = document.getElementById('changeReason').value.trim();

        if (!newGate) {
            alert('Gate number is required');
            return;
        }

        try {
            const response = await fetch(`${this.apiBase}/flights/${flightId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    gate_no: newGate,
                    status: status,
                    delay_minutes: delayMinutes || null,
                    reason: reason || null
                })
            });

            const result = await response.json();

            if (result.success) {
                alert(`Flight updated!\n${result.notifications_sent} passengers notified.`);
                this.closeGateModal();
                this.loadFlights();
            } else {
                alert('Update failed: ' + result.error);
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }

    closeGateModal() {
        const modal = document.getElementById('gateChangeModal');
        if (modal) {
            modal.style.display = 'none';
        }
        document.getElementById('gateChangeForm').reset();
    }

    formatTime(timeString) {
        if (!timeString) return '--:--';
        const date = new Date(timeString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Global functions
window.openFlightModal = function(flightId, flightNo, gate, status) {
    console.log('Global openFlightModal called:', flightId, flightNo, gate, status);
    if (window.flightManager) {
        window.flightManager.openGateModal(flightId, flightNo, gate, status);
    } else {
        console.error('flightManager not initialized!');
        alert('Error: Flight manager not initialized');
    }
};

window.closeGateModal = function() {
    console.log('Global closeGateModal called');
    if (window.flightManager) {
        window.flightManager.closeGateModal();
    }
};

// Initialize
window.flightManager = null;

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing FlightManager');
    window.flightManager = new FlightManager();
});

console.log('flights-debug.js loaded');
