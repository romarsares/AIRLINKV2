/**
 * Flight & Gate Management Module
 */
class FlightManager {
    constructor() {
        this.apiBase = 'http://localhost:3000/api';
        this.init();
    }

    init() {
        this.loadFlights();
        this.setupEventListeners();
        setInterval(() => this.loadFlights(), 30000);
    }

    setupEventListeners() {
        document.getElementById('flightStatus')?.addEventListener('change', (e) => {
            const status = e.target.value;
            document.getElementById('delayGroup').style.display = 
                status === 'Delayed' ? 'block' : 'none';
            document.getElementById('reasonGroup').style.display = 
                ['Delayed', 'Cancelled'].includes(status) ? 'block' : 'none';
        });

        document.getElementById('gateChangeForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateFlight();
        });
    }

    async loadFlights() {
        try {
            const response = await fetch(`${this.apiBase}/flights`);
            const data = await response.json();
            if (data.success) this.displayFlights(data.flights);
        } catch (error) {
            console.error('Failed to load flights:', error);
        }
    }

    displayFlights(flights) {
        const tbody = document.getElementById('flightsTableBody');
        if (!tbody) return;

        if (!flights || flights.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No flights found</td></tr>';
            return;
        }

        tbody.innerHTML = flights.map(flight => {
            const flightId = flight.flight_id;
            const flightNo = (flight.flight_no || '').replace(/'/g, '\\&#39;');
            const gateNo = (flight.gate_no || 'N/A').replace(/'/g, '\\&#39;');
            const status = (flight.status || 'Scheduled').replace(/'/g, '\\&#39;');
            
            return `
                <tr>
                    <td><strong>${flight.flight_no || 'N/A'}</strong></td>
                    <td>${flight.destination || 'N/A'}</td>
                    <td><span class="gate-badge">${flight.gate_no || 'N/A'}</span></td>
                    <td>${this.formatTime(flight.departure_time)}</td>
                    <td><span class="status-badge ${(flight.status || 'scheduled').toLowerCase()}">${flight.status || 'Scheduled'}</span></td>
                    <td>${flight.passenger_count || 0}</td>
                    <td>
                        <button onclick="window.flightManager.openGateModal(${flightId}, '${flightNo}', '${gateNo}', '${status}')" 
                                class="btn-small">Update</button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    openGateModal(flightId, flightNo, currentGate, currentStatus) {
        console.log('Opening modal for flight:', flightId, flightNo, currentGate, currentStatus);
        
        const modal = document.getElementById('gateChangeModal');
        if (!modal) {
            console.error('Modal not found!');
            return;
        }
        
        document.getElementById('flightId').value = flightId;
        document.getElementById('flightNumber').value = flightNo;
        document.getElementById('newGate').value = currentGate;
        document.getElementById('flightStatus').value = currentStatus;
        
        // Reset conditional fields
        document.getElementById('delayGroup').style.display = 'none';
        document.getElementById('reasonGroup').style.display = 'none';
        
        modal.style.display = 'flex';
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
        document.getElementById('gateChangeModal').style.display = 'none';
        document.getElementById('gateChangeForm').reset();
    }

    formatTime(timeString) {
        const date = new Date(timeString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Initialize as global variable
window.flightManager = null;

document.addEventListener('DOMContentLoaded', () => {
    window.flightManager = new FlightManager();
});

function closeGateModal() {
    if (window.flightManager) {
        window.flightManager.closeGateModal();
    }
}
