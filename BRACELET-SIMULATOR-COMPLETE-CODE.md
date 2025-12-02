# AirLink Bracelet Simulator - Complete Code Documentation

## 📁 File Structure
```
bracelet-simulator/
├── index.html         # Main simulator interface
├── css/
│   └── simulator.css  # Simulator styles
└── js/
    ├── bracelet.js    # Core bracelet logic
    ├── sync.js        # Server synchronization
    └── simulator.js   # UI simulation controls
```

---

## 🎯 1. index.html (Bracelet Simulator Interface)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AirLink Bracelet Simulator</title>
    <link rel="stylesheet" href="css/simulator.css">
</head>
<body>
    <div class="simulator-container">
        <div class="bracelet-device">
            <div class="device-header">
                <h2>AirLink Bracelet</h2>
                <div class="device-id" id="deviceId">GES001</div>
                <div class="battery-indicator">
                    <span id="batteryLevel">85%</span>
                    <div class="battery-bar">
                        <div class="battery-fill" id="batteryFill"></div>
                    </div>
                </div>
            </div>

            <div class="device-screen">
                <div class="status-led" id="statusLed"></div>
                <div class="passenger-info" id="passengerInfo">
                    <div class="passenger-name">Not Assigned</div>
                    <div class="flight-number">---</div>
                    <div class="gate-number">Gate: --</div>
                    <div class="boarding-time">--:--</div>
                </div>
                <div class="notifications" id="notifications"></div>
            </div>

            <div class="device-controls">
                <button id="syncBtn" class="control-btn">Sync</button>
                <button id="nfcBtn" class="control-btn">NFC Scan</button>
                <button id="resetBtn" class="control-btn reset">Reset</button>
            </div>
        </div>

        <div class="simulator-panel">
            <h3>Simulator Controls</h3>
            
            <div class="control-group">
                <label>Bracelet Assignment:</label>
                <select id="passengerSelect">
                    <option value="">Select Passenger</option>
                </select>
                <button id="assignBtn" class="btn-primary">Assign</button>
            </div>

            <div class="control-group">
                <label>Battery Level:</label>
                <input type="range" id="batterySlider" min="0" max="100" value="85">
                <span id="batteryDisplay">85%</span>
            </div>

            <div class="control-group">
                <label>Connection Status:</label>
                <select id="connectionStatus">
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                </select>
            </div>

            <div class="sync-logs">
                <h4>Sync Activity</h4>
                <div id="syncLogs" class="log-container"></div>
            </div>
        </div>
    </div>

    <script src="js/bracelet.js"></script>
    <script src="js/sync.js"></script>
    <script src="js/simulator.js"></script>
</body>
</html>
```

---

## ⌚ 2. bracelet.js (Core Bracelet Logic)

```javascript
/**
 * AirLink Bracelet Core Logic
 */
class AirLinkBracelet {
    constructor(deviceId) {
        this.deviceId = deviceId;
        this.batteryLevel = 85;
        this.isAssigned = false;
        this.passengerData = null;
        this.flightData = null;
        this.connectionStatus = 'online';
        this.lastSyncTime = null;
        this.notifications = [];
        
        this.initializeDevice();
    }

    initializeDevice() {
        this.updateDisplay();
        this.startHeartbeat();
        console.log(`Bracelet ${this.deviceId} initialized`);
    }

    // Assign passenger and flight data to bracelet
    assignPassenger(passengerData, flightData) {
        this.passengerData = {
            id: passengerData.passenger_id,
            name: this.sanitizeInput(passengerData.passenger_name),
            bookingId: passengerData.booking_id
        };
        
        this.flightData = {
            flightNumber: this.sanitizeInput(flightData.flight_no),
            gate: this.sanitizeInput(flightData.gate_no),
            departureTime: flightData.departure_time,
            destination: this.sanitizeInput(flightData.destination)
        };
        
        this.isAssigned = true;
        this.updateDisplay();
        this.addNotification('Passenger assigned successfully', 'success');
        
        // Auto-sync after assignment
        setTimeout(() => this.syncWithServer(), 1000);
    }

    // Input sanitization
    sanitizeInput(input) {
        if (typeof input !== 'string') return String(input || '');
        return input.replace(/[<>"'&]/g, '');
    }

    // Update bracelet display
    updateDisplay() {
        const elements = {
            deviceId: document.getElementById('deviceId'),
            batteryLevel: document.getElementById('batteryLevel'),
            batteryFill: document.getElementById('batteryFill'),
            passengerInfo: document.getElementById('passengerInfo'),
            statusLed: document.getElementById('statusLed')
        };

        if (elements.deviceId) elements.deviceId.textContent = this.deviceId;
        if (elements.batteryLevel) elements.batteryLevel.textContent = `${this.batteryLevel}%`;
        if (elements.batteryFill) elements.batteryFill.style.width = `${this.batteryLevel}%`;

        if (elements.passengerInfo) {
            if (this.isAssigned && this.passengerData && this.flightData) {
                elements.passengerInfo.innerHTML = `
                    <div class="passenger-name">${this.passengerData.name}</div>
                    <div class="flight-number">${this.flightData.flightNumber}</div>
                    <div class="gate-number">Gate: ${this.flightData.gate}</div>
                    <div class="boarding-time">${this.formatTime(this.flightData.departureTime)}</div>
                `;
            } else {
                elements.passengerInfo.innerHTML = `
                    <div class="passenger-name">Not Assigned</div>
                    <div class="flight-number">---</div>
                    <div class="gate-number">Gate: --</div>
                    <div class="boarding-time">--:--</div>
                `;
            }
        }

        // Update status LED
        if (elements.statusLed) {
            elements.statusLed.className = 'status-led';
            if (this.connectionStatus === 'offline') {
                elements.statusLed.classList.add('offline');
            } else if (this.isAssigned) {
                elements.statusLed.classList.add('assigned');
            } else {
                elements.statusLed.classList.add('ready');
            }
        }
    }

    // Format time display
    formatTime(timeString) {
        if (!timeString) return '--:--';
        const date = new Date(timeString);
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });
    }

    // Add notification to bracelet
    addNotification(message, type = 'info') {
        const notification = {
            id: Date.now(),
            message: this.sanitizeInput(message),
            type: type,
            timestamp: new Date()
        };
        
        this.notifications.unshift(notification);
        if (this.notifications.length > 5) {
            this.notifications = this.notifications.slice(0, 5);
        }
        
        this.updateNotificationDisplay();
        
        // Auto-remove after 5 seconds for non-critical notifications
        if (type !== 'error') {
            setTimeout(() => this.removeNotification(notification.id), 5000);
        }
    }

    // Update notification display
    updateNotificationDisplay() {
        const container = document.getElementById('notifications');
        if (!container) return;

        container.innerHTML = this.notifications.map(notif => `
            <div class="notification ${notif.type}">
                <span class="notif-message">${notif.message}</span>
                <span class="notif-time">${this.formatTime(notif.timestamp)}</span>
            </div>
        `).join('');
    }

    // Remove notification
    removeNotification(notificationId) {
        this.notifications = this.notifications.filter(n => n.id !== notificationId);
        this.updateNotificationDisplay();
    }

    // Simulate NFC scan for boarding verification
    performNFCScan() {
        if (!this.isAssigned) {
            this.addNotification('No passenger assigned', 'error');
            return false;
        }

        if (this.connectionStatus === 'offline') {
            this.addNotification('Cannot verify - offline', 'error');
            return false;
        }

        // Simulate verification process
        this.addNotification('Verifying boarding...', 'info');
        
        setTimeout(() => {
            const verified = Math.random() > 0.1; // 90% success rate
            if (verified) {
                this.addNotification('Boarding verified ✓', 'success');
                this.logSyncActivity('NFC_SCAN', 'SUCCESS', 'Boarding verification successful');
            } else {
                this.addNotification('Verification failed ✗', 'error');
                this.logSyncActivity('NFC_SCAN', 'FAILED', 'Boarding verification failed');
            }
        }, 2000);

        return true;
    }

    // Sync with server
    async syncWithServer() {
        if (this.connectionStatus === 'offline') {
            this.addNotification('Sync failed - offline', 'error');
            return false;
        }

        try {
            this.addNotification('Syncing...', 'info');
            
            const syncData = {
                bracelet_id: this.deviceId,
                battery_level: this.batteryLevel,
                passenger_data: this.passengerData,
                flight_data: this.flightData,
                timestamp: new Date().toISOString()
            };

            // Simulate API call
            await this.simulateAPICall('/api/bracelets/sync', syncData);
            
            this.lastSyncTime = new Date();
            this.addNotification('Sync successful ✓', 'success');
            this.logSyncActivity('HEARTBEAT', 'SUCCESS', 'Data synchronized');
            
            return true;
        } catch (error) {
            this.addNotification('Sync failed ✗', 'error');
            this.logSyncActivity('HEARTBEAT', 'FAILED', error.message);
            return false;
        }
    }

    // Simulate API call
    async simulateAPICall(endpoint, data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.05) { // 95% success rate
                    resolve({ success: true, data: data });
                } else {
                    reject(new Error('Network timeout'));
                }
            }, 1000 + Math.random() * 2000);
        });
    }

    // Log sync activity
    logSyncActivity(type, status, message) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            bracelet_id: this.deviceId,
            sync_type: type,
            status: status,
            message: this.sanitizeInput(message)
        };

        // Add to sync logs display
        const logsContainer = document.getElementById('syncLogs');
        if (logsContainer) {
            const logElement = document.createElement('div');
            logElement.className = `log-entry ${status.toLowerCase()}`;
            logElement.innerHTML = `
                <span class="log-time">${this.formatTime(logEntry.timestamp)}</span>
                <span class="log-type">${type}</span>
                <span class="log-message">${message}</span>
            `;
            
            logsContainer.insertBefore(logElement, logsContainer.firstChild);
            
            // Keep only last 10 entries
            while (logsContainer.children.length > 10) {
                logsContainer.removeChild(logsContainer.lastChild);
            }
        }
    }

    // Start heartbeat sync
    startHeartbeat() {
        setInterval(() => {
            if (this.connectionStatus === 'online' && this.isAssigned) {
                this.syncWithServer();
            }
            
            // Simulate battery drain
            if (this.batteryLevel > 0) {
                this.batteryLevel = Math.max(0, this.batteryLevel - 0.1);
                this.updateDisplay();
            }
        }, 30000); // Every 30 seconds
    }

    // Reset bracelet
    reset() {
        this.isAssigned = false;
        this.passengerData = null;
        this.flightData = null;
        this.notifications = [];
        this.batteryLevel = 85;
        this.lastSyncTime = null;
        
        this.updateDisplay();
        this.updateNotificationDisplay();
        this.addNotification('Bracelet reset', 'info');
        this.logSyncActivity('RESET', 'SUCCESS', 'Bracelet reset to default state');
    }

    // Update battery level
    setBatteryLevel(level) {
        this.batteryLevel = Math.max(0, Math.min(100, level));
        this.updateDisplay();
    }

    // Set connection status
    setConnectionStatus(status) {
        this.connectionStatus = status;
        this.updateDisplay();
        this.addNotification(`Connection: ${status}`, status === 'online' ? 'success' : 'error');
    }
}
```

---

## 🔄 3. sync.js (Server Synchronization)

```javascript
/**
 * Server Synchronization Module
 */
class BraceletSync {
    constructor(bracelet) {
        this.bracelet = bracelet;
        this.apiBase = 'http://localhost:3000/api';
        this.syncQueue = [];
        this.isOnline = true;
    }

    // Fetch available passengers for assignment
    async fetchPassengers() {
        try {
            const response = await fetch(`${this.apiBase}/bookings?status=confirmed`);
            if (!response.ok) throw new Error('Failed to fetch passengers');
            
            const data = await response.json();
            return data.bookings || [];
        } catch (error) {
            console.error('Error fetching passengers:', error);
            return [];
        }
    }

    // Assign bracelet to passenger
    async assignBracelet(bookingId) {
        try {
            const response = await fetch(`${this.apiBase}/bracelets/assign`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bracelet_id: this.bracelet.deviceId,
                    booking_id: bookingId
                })
            });

            if (!response.ok) throw new Error('Assignment failed');
            
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error assigning bracelet:', error);
            throw error;
        }
    }

    // Verify boarding
    async verifyBoarding() {
        try {
            const response = await fetch(`${this.apiBase}/bracelets/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bracelet_id: this.bracelet.deviceId,
                    gate_scan: true,
                    timestamp: new Date().toISOString()
                })
            });

            if (!response.ok) throw new Error('Verification failed');
            
            const result = await response.json();
            return result.verified;
        } catch (error) {
            console.error('Error verifying boarding:', error);
            return false;
        }
    }

    // Send heartbeat to server
    async sendHeartbeat() {
        if (!this.isOnline) return false;

        try {
            const heartbeatData = {
                bracelet_id: this.bracelet.deviceId,
                battery_level: this.bracelet.batteryLevel,
                status: this.bracelet.isAssigned ? 'assigned' : 'ready',
                timestamp: new Date().toISOString()
            };

            const response = await fetch(`${this.apiBase}/bracelets/heartbeat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(heartbeatData)
            });

            return response.ok;
        } catch (error) {
            console.error('Heartbeat failed:', error);
            return false;
        }
    }
}
```

---

## 🎮 4. simulator.js (UI Simulation Controls)

```javascript
/**
 * Bracelet Simulator UI Controls
 */
class BraceletSimulator {
    constructor() {
        this.bracelet = new AirLinkBracelet('GES001');
        this.sync = new BraceletSync(this.bracelet);
        this.initializeControls();
        this.loadPassengers();
    }

    initializeControls() {
        // Sync button
        document.getElementById('syncBtn')?.addEventListener('click', () => {
            this.bracelet.syncWithServer();
        });

        // NFC scan button
        document.getElementById('nfcBtn')?.addEventListener('click', () => {
            this.bracelet.performNFCScan();
        });

        // Reset button
        document.getElementById('resetBtn')?.addEventListener('click', () => {
            if (confirm('Reset bracelet? This will clear all data.')) {
                this.bracelet.reset();
            }
        });

        // Assignment controls
        document.getElementById('assignBtn')?.addEventListener('click', () => {
            this.assignSelectedPassenger();
        });

        // Battery slider
        const batterySlider = document.getElementById('batterySlider');
        const batteryDisplay = document.getElementById('batteryDisplay');
        
        batterySlider?.addEventListener('input', (e) => {
            const level = parseInt(e.target.value);
            this.bracelet.setBatteryLevel(level);
            if (batteryDisplay) batteryDisplay.textContent = `${level}%`;
        });

        // Connection status
        document.getElementById('connectionStatus')?.addEventListener('change', (e) => {
            this.bracelet.setConnectionStatus(e.target.value);
        });
    }

    // Load available passengers
    async loadPassengers() {
        try {
            const passengers = await this.sync.fetchPassengers();
            const select = document.getElementById('passengerSelect');
            
            if (select) {
                select.innerHTML = '<option value="">Select Passenger</option>';
                passengers.forEach(booking => {
                    const option = document.createElement('option');
                    option.value = booking.booking_id;
                    option.textContent = `${booking.passenger_name} - ${booking.flight_no}`;
                    select.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Failed to load passengers:', error);
        }
    }

    // Assign selected passenger
    async assignSelectedPassenger() {
        const select = document.getElementById('passengerSelect');
        const bookingId = select?.value;
        
        if (!bookingId) {
            alert('Please select a passenger');
            return;
        }

        try {
            const result = await this.sync.assignBracelet(bookingId);
            
            if (result.success) {
                this.bracelet.assignPassenger(result.passenger, result.flight);
                select.value = '';
            } else {
                alert('Assignment failed: ' + result.error);
            }
        } catch (error) {
            alert('Assignment error: ' + error.message);
        }
    }
}

// Initialize simulator when page loads
document.addEventListener('DOMContentLoaded', () => {
    new BraceletSimulator();
});
```

---

## 🎨 5. simulator.css (Simulator Styles)

```css
/* Bracelet Simulator Styles */
.simulator-container {
    display: flex;
    gap: 20px;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: #f5f5f5;
    min-height: 100vh;
}

.bracelet-device {
    background: #2c3e50;
    border-radius: 20px;
    padding: 20px;
    width: 300px;
    color: white;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
}

.device-header {
    text-align: center;
    margin-bottom: 20px;
}

.device-id {
    font-size: 14px;
    color: #bdc3c7;
    margin: 5px 0;
}

.battery-indicator {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 10px;
}

.battery-bar {
    flex: 1;
    height: 8px;
    background: #34495e;
    border-radius: 4px;
    overflow: hidden;
}

.battery-fill {
    height: 100%;
    background: linear-gradient(90deg, #e74c3c, #f39c12, #27ae60);
    transition: width 0.3s ease;
}

.device-screen {
    background: #34495e;
    border-radius: 10px;
    padding: 15px;
    margin: 20px 0;
    min-height: 200px;
}

.status-led {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin: 0 auto 15px;
    background: #7f8c8d;
}

.status-led.ready { background: #3498db; }
.status-led.assigned { background: #27ae60; }
.status-led.offline { background: #e74c3c; }

.passenger-info div {
    margin: 8px 0;
    text-align: center;
}

.passenger-name {
    font-weight: bold;
    font-size: 16px;
}

.flight-number {
    color: #3498db;
    font-size: 14px;
}

.notifications {
    margin-top: 15px;
}

.notification {
    background: rgba(255,255,255,0.1);
    padding: 8px;
    border-radius: 5px;
    margin: 5px 0;
    font-size: 12px;
}

.notification.success { background: rgba(39,174,96,0.3); }
.notification.error { background: rgba(231,76,60,0.3); }

.device-controls {
    display: flex;
    gap: 10px;
    margin-top: 20px;
}

.control-btn {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 5px;
    background: #3498db;
    color: white;
    cursor: pointer;
    font-size: 12px;
}

.control-btn:hover {
    background: #2980b9;
}

.control-btn.reset {
    background: #e74c3c;
}

.simulator-panel {
    background: white;
    border-radius: 10px;
    padding: 20px;
    flex: 1;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.control-group {
    margin: 15px 0;
}

.control-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

.control-group select,
.control-group input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.btn-primary {
    background: #3498db;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
}

.log-container {
    max-height: 300px;
    overflow-y: auto;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 10px;
}

.log-entry {
    padding: 5px;
    margin: 2px 0;
    border-radius: 3px;
    font-size: 12px;
}

.log-entry.success { background: #d4edda; }
.log-entry.failed { background: #f8d7da; }

.log-time {
    color: #666;
    margin-right: 10px;
}

.log-type {
    font-weight: bold;
    margin-right: 10px;
}
```

---

## 📋 Usage Instructions

1. **Setup**: Place files in `bracelet-simulator/` directory
2. **Initialize**: Open `index.html` in browser
3. **Assign Passenger**: Select from dropdown and click "Assign"
4. **Test Functions**: Use Sync, NFC Scan, and Reset buttons
5. **Monitor**: View real-time sync logs and notifications

## 🔧 Key Features

- **Real-time Sync**: Automatic heartbeat every 30 seconds
- **NFC Simulation**: Boarding verification with 90% success rate
- **Battery Simulation**: Gradual drain with visual indicator
- **Connection States**: Online/offline mode switching
- **Notification System**: Real-time alerts and status updates
- **Sync Logging**: Complete audit trail of all activities

## 🛡️ Security Features

- Input sanitization for all user data
- Secure API communication simulation
- Error handling and validation
- Connection status monitoring

---

### Patch 0016 - 2024-12-20
**Task**: Complete Bracelet Simulator Implementation
**Changes**:
- Created comprehensive bracelet simulator with 5 core files
- Implemented real-time sync, NFC scanning, and battery simulation
- Added passenger assignment and boarding verification
- Included notification system and sync activity logging
- Provided complete UI controls and visual feedback system