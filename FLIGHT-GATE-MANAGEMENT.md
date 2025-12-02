# Flight & Gate Management System

## Admin Dashboard - Flight Schedule & Gate Changes

### 1. HTML Addition (Add to Flights Section)

```html
<!-- Flights Section -->
<section id="flights" class="section">
    <h2>Flight Schedule & Gates</h2>
    
    <div class="flights-table">
        <table id="flightsTable">
            <thead>
                <tr>
                    <th>Flight No</th>
                    <th>Destination</th>
                    <th>Gate</th>
                    <th>Departure</th>
                    <th>Status</th>
                    <th>Passengers</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="flightsTableBody"></tbody>
        </table>
    </div>
</section>

<!-- Gate Change Modal -->
<div id="gateChangeModal" class="modal">
    <div class="modal-content">
        <h3>Update Flight</h3>
        <form id="gateChangeForm">
            <input type="hidden" id="flightId">
            
            <div class="form-group">
                <label>Flight Number</label>
                <input type="text" id="flightNumber" readonly>
            </div>
            
            <div class="form-group">
                <label>Gate Number</label>
                <input type="text" id="newGate" required placeholder="e.g., G5">
            </div>
            
            <div class="form-group">
                <label>Flight Status</label>
                <select id="flightStatus" required>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Boarding">Boarding</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Departed">Departed</option>
                </select>
            </div>
            
            <div class="form-group" id="delayGroup" style="display:none;">
                <label>Delay Minutes</label>
                <input type="number" id="delayMinutes" min="0">
            </div>
            
            <div class="form-group" id="reasonGroup" style="display:none;">
                <label>Reason</label>
                <textarea id="changeReason" rows="3" placeholder="e.g., Aircraft maintenance required"></textarea>
            </div>
            
            <div class="modal-actions">
                <button type="submit" class="btn-primary">Update Flight</button>
                <button type="button" class="btn-secondary" onclick="closeGateModal()">Cancel</button>
            </div>
        </form>
    </div>
</div>
```

### 2. JavaScript - Flight Management (flights.js)

```javascript
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
        
        // Auto-refresh every 30 seconds
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
            
            if (data.success) {
                this.displayFlights(data.flights);
            }
        } catch (error) {
            console.error('Failed to load flights:', error);
        }
    }

    displayFlights(flights) {
        const tbody = document.getElementById('flightsTableBody');
        if (!tbody) return;

        tbody.innerHTML = flights.map(flight => `
            <tr class="status-${flight.status.toLowerCase()}">
                <td><strong>${flight.flight_no}</strong></td>
                <td>${flight.destination}</td>
                <td><span class="gate-badge">${flight.gate_no}</span></td>
                <td>${this.formatTime(flight.departure_time)}</td>
                <td><span class="status-badge ${flight.status.toLowerCase()}">${flight.status}</span></td>
                <td>${flight.passenger_count || 0}</td>
                <td>
                    <button onclick="flightManager.openGateModal(${flight.flight_id}, '${flight.flight_no}', '${flight.gate_no}', '${flight.status}')" 
                            class="btn-small">Update</button>
                </td>
            </tr>
        `).join('');
    }

    openGateModal(flightId, flightNo, currentGate, currentStatus) {
        document.getElementById('flightId').value = flightId;
        document.getElementById('flightNumber').value = flightNo;
        document.getElementById('newGate').value = currentGate;
        document.getElementById('flightStatus').value = currentStatus;
        document.getElementById('gateChangeModal').style.display = 'flex';
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
                alert(`Flight updated successfully!\n${result.notifications_sent} passengers notified.`);
                this.closeGateModal();
                this.loadFlights();
            } else {
                alert('Update failed: ' + result.error);
            }
        } catch (error) {
            alert('Error updating flight: ' + error.message);
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

// Initialize
let flightManager;
document.addEventListener('DOMContentLoaded', () => {
    flightManager = new FlightManager();
});

function closeGateModal() {
    flightManager.closeGateModal();
}
```

### 3. CSS Styles (Add to style.css)

```css
/* Flight Table */
.flights-table {
    overflow-x: auto;
    background: white;
    border-radius: 8px;
    padding: 20px;
}

.flights-table table {
    width: 100%;
    border-collapse: collapse;
}

.flights-table th {
    background: #34495e;
    color: white;
    padding: 12px;
    text-align: left;
    font-weight: 600;
}

.flights-table td {
    padding: 12px;
    border-bottom: 1px solid #ecf0f1;
}

.flights-table tr:hover {
    background: #f8f9fa;
}

/* Status Badges */
.status-badge {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
}

.status-badge.scheduled { background: #3498db; color: white; }
.status-badge.boarding { background: #27ae60; color: white; }
.status-badge.delayed { background: #f39c12; color: white; }
.status-badge.cancelled { background: #e74c3c; color: white; }
.status-badge.departed { background: #95a5a6; color: white; }

.gate-badge {
    background: #2c3e50;
    color: white;
    padding: 4px 10px;
    border-radius: 4px;
    font-weight: bold;
}

/* Modal */
.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 30px;
    border-radius: 10px;
    width: 90%;
    max-width: 500px;
}

.modal-content h3 {
    margin-top: 0;
    color: #2c3e50;
}

.form-group {
    margin: 15px 0;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: 600;
    color: #34495e;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
}

.modal-actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
}

.btn-small {
    padding: 6px 12px;
    font-size: 12px;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.btn-small:hover {
    background: #2980b9;
}
```

### 4. Backend API Endpoint (server.js)

```javascript
// Update flight status and gate
app.put('/api/flights/:id/status', async (req, res) => {
    const { id } = req.params;
    const { gate_no, status, delay_minutes, reason } = req.body;

    try {
        // Update flight
        await db.query(
            `UPDATE flights 
             SET gate_no = ?, status = ?, delay_minutes = ?, 
                 cancellation_reason = ?, updated_at = NOW()
             WHERE flight_id = ?`,
            [gate_no, status, delay_minutes, reason, id]
        );

        // Get all passengers on this flight
        const [passengers] = await db.query(
            `SELECT b.booking_id, b.passenger_id, p.passenger_name, br.bracelet_id
             FROM bookings b
             JOIN passengers p ON b.passenger_id = p.passenger_id
             LEFT JOIN bracelets br ON b.booking_id = br.booking_id
             WHERE b.flight_id = ?`,
            [id]
        );

        // Send notifications to all passengers
        let notificationMessage = '';
        if (status === 'Delayed') {
            notificationMessage = `Flight Delayed: ${delay_minutes} minutes. New gate: ${gate_no}`;
        } else if (status === 'Cancelled') {
            notificationMessage = `Flight Cancelled: ${reason}`;
        } else {
            notificationMessage = `Gate Changed to ${gate_no}`;
        }

        for (const passenger of passengers) {
            await db.query(
                `INSERT INTO notifications (booking_id, notification_type, message, created_at)
                 VALUES (?, ?, ?, NOW())`,
                [passenger.booking_id, 'GATE_CHANGE', notificationMessage]
            );
        }

        res.json({
            success: true,
            notifications_sent: passengers.length,
            message: 'Flight updated and passengers notified'
        });

    } catch (error) {
        console.error('Error updating flight:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});
```

---

## Usage Workflow

### Scenario: Airplane Damaged, Gate Change Required

1. **Admin logs into dashboard**
2. **Navigates to "Flights" section**
3. **Sees flight PR123 at Gate G1**
4. **Clicks "Update" button**
5. **Modal opens with current flight info**
6. **Admin changes:**
   - Gate: G1 → G5
   - Status: Scheduled → Delayed
   - Delay: 45 minutes
   - Reason: "Aircraft maintenance - mechanical issue"
7. **Clicks "Update Flight"**
8. **System automatically:**
   - Updates flight record
   - Sends notifications to all 200 passengers
   - Bracelets sync new gate within 30 seconds
   - Passengers see: "Gate Changed to G5 - Flight Delayed 45 min"

---

### Patch 0017 - 2024-12-20
**Task**: Flight & Gate Management UI
**Changes**:
- Added flight schedule table with real-time status
- Implemented gate change modal with validation
- Added flight status updates (Scheduled, Boarding, Delayed, Cancelled, Departed)
- Automatic passenger notifications on gate/status changes
- Visual status badges and gate indicators
- Auto-refresh every 30 seconds
- Integrated with existing Patch 0014 backend API
