// Dashboard Module
class Dashboard {
    constructor() {
        this.currentSection = 'overview';
        this.refreshInterval = null;
    }

    // Initialize dashboard
    init() {
        this.setupNavigation();
        this.setupEventListeners();
        this.updateUserInfo();
        this.startClock();
        this.loadOverview();
        
        // Auto-refresh every 30 seconds
        this.refreshInterval = setInterval(() => {
            if (this.currentSection === 'overview') {
                this.loadOverview();
            }
        }, 30000);
    }

    // Setup navigation
    setupNavigation() {
        const navBtns = document.querySelectorAll('.nav-btn');
        navBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.dataset.section;
                this.showSection(section);
            });
        });
    }

    // Show specific section
    showSection(sectionName) {
        // Update nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Update sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionName).classList.add('active');

        this.currentSection = sectionName;

        // Load section data
        if (sectionName === 'overview') {
            this.loadOverview();
        } else if (sectionName === 'logs') {
            this.loadSyncLogs();
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Overview
        document.getElementById('refreshOverview').addEventListener('click', () => this.loadOverview());
        
        // Force sync (Admin only)
        if (auth.isAdmin()) {
            const forceSyncBtn = document.getElementById('forceSync');
            forceSyncBtn.style.display = 'inline-block';
            forceSyncBtn.addEventListener('click', () => this.forceSync());
        }

        // Bookings
        document.getElementById('searchBookingBtn').addEventListener('click', () => this.searchBooking());
        document.getElementById('bookingSearch').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchBooking();
        });

        // Bracelets
        document.getElementById('assignBtn').addEventListener('click', () => this.assignBracelet());
        document.getElementById('verifyBtn').addEventListener('click', () => this.verifyBracelet());
        document.getElementById('statusBtn').addEventListener('click', () => this.checkBraceletStatus());

        // Logs
        document.getElementById('logFilter').addEventListener('change', () => this.loadSyncLogs());
    }

    // Update user info
    updateUserInfo() {
        document.getElementById('userRole').textContent = auth.getRole();
        
        // Hide admin-only features for operators
        if (!auth.isAdmin()) {
            document.getElementById('logsTab').style.display = 'none';
        }
    }

    // Start clock
    startClock() {
        const updateTime = () => {
            const now = new Date();
            document.getElementById('currentTime').textContent = now.toLocaleTimeString();
        };
        updateTime();
        setInterval(updateTime, 1000);
    }

    // Load system overview
    async loadOverview() {
        try {
            const data = await api.getOverview();
            document.getElementById('totalBookings').textContent = data.total_bookings;
            document.getElementById('activeFlights').textContent = data.active_flights;
            document.getElementById('activeBracelets').textContent = data.active_bracelets;
            document.getElementById('recentSyncs').textContent = data.recent_syncs;
        } catch (error) {
            this.showError('Failed to load overview: ' + error.message);
        }
    }

    // Search booking
    async searchBooking() {
        const bookingId = document.getElementById('bookingSearch').value.trim();
        if (!bookingId) return;

        try {
            const booking = await api.getBooking(bookingId);
            this.displayBookingResult(booking);
        } catch (error) {
            this.displayBookingResult(null, error.message);
        }
    }

    // Display booking result
    displayBookingResult(booking, error = null) {
        const container = document.getElementById('bookingResult');
        
        if (error) {
            container.innerHTML = `<div class="result-item result-error">Error: ${error}</div>`;
            return;
        }

        container.innerHTML = `
            <div class="result-item result-success">
                <h4>Booking #${booking.booking_id}</h4>
                <p><strong>Passenger:</strong> ${booking.name}</p>
                <p><strong>Flight:</strong> ${booking.flight_no} to ${booking.destination}</p>
                <p><strong>Seat:</strong> ${booking.seat_no}</p>
                <p><strong>Status:</strong> ${booking.booking_status}</p>
                <p><strong>Bracelet:</strong> ${booking.assigned_bracelet || 'Not assigned'}</p>
            </div>
        `;
    }

    // Assign bracelet
    async assignBracelet() {
        const bookingId = document.getElementById('assignBookingId').value.trim();
        const braceletId = document.getElementById('assignBraceletId').value.trim();
        
        if (!bookingId || !braceletId) {
            this.showBraceletResult('Please fill in both Booking ID and Bracelet ID', true);
            return;
        }

        try {
            const result = await api.assignBracelet(parseInt(bookingId), braceletId);
            this.showBraceletResult(`Success: ${result.message}`, false);
            this.clearBraceletInputs();
        } catch (error) {
            this.showBraceletResult(`Error: ${error.message}`, true);
        }
    }

    // Verify bracelet
    async verifyBracelet() {
        const braceletId = document.getElementById('verifyBraceletId').value.trim();
        const gateNo = document.getElementById('verifyGateNo').value.trim();
        
        if (!braceletId || !gateNo) {
            this.showBraceletResult('Please fill in both Bracelet ID and Gate Number', true);
            return;
        }

        try {
            const result = await api.verifyBracelet(braceletId, gateNo);
            if (result.status === 'Cleared') {
                this.showBraceletResult(`✅ Boarding Cleared - ${result.passenger_name} (${result.flight_no}, Seat ${result.seat_no})`, false);
            } else {
                this.showBraceletResult(`❌ Boarding Denied - ${result.message}`, true);
            }
            this.clearBraceletInputs();
        } catch (error) {
            this.showBraceletResult(`Error: ${error.message}`, true);
        }
    }

    // Check bracelet status
    async checkBraceletStatus() {
        const braceletId = document.getElementById('statusBraceletId').value.trim();
        
        if (!braceletId) {
            this.showBraceletResult('Please enter Bracelet ID', true);
            return;
        }

        try {
            const status = await api.getBraceletStatus(braceletId);
            this.showBraceletResult(`Status: ${status.status} | Battery: ${status.battery_level}% | Last Sync: ${status.last_sync_time || 'Never'}`, false);
        } catch (error) {
            this.showBraceletResult(`Error: ${error.message}`, true);
        }
    }

    // Show bracelet operation result
    showBraceletResult(message, isError) {
        const container = document.getElementById('braceletResult');
        const className = isError ? 'result-error' : 'result-success';
        container.innerHTML = `<div class="result-item ${className}">${message}</div>`;
    }

    // Clear bracelet inputs
    clearBraceletInputs() {
        document.getElementById('assignBookingId').value = '';
        document.getElementById('assignBraceletId').value = '';
        document.getElementById('verifyBraceletId').value = '';
        document.getElementById('verifyGateNo').value = '';
        document.getElementById('statusBraceletId').value = '';
    }

    // Load sync logs
    async loadSyncLogs() {
        if (!auth.isAdmin()) return;

        const filter = document.getElementById('logFilter').value;
        
        try {
            const data = await api.getSyncLogs(filter);
            this.displaySyncLogs(data.logs);
        } catch (error) {
            this.showError('Failed to load sync logs: ' + error.message);
        }
    }

    // Display sync logs
    displaySyncLogs(logs) {
        const container = document.getElementById('logsResult');
        
        if (!logs || logs.length === 0) {
            container.innerHTML = '<div class="result-item">No logs found</div>';
            return;
        }

        const logsHtml = logs.map(log => `
            <div class="result-item ${log.sync_status === 'Failed' ? 'result-error' : ''}">
                <strong>Log #${log.log_id}</strong> - ${log.sync_status}
                <br>Bracelet: ${log.bracelet_id || 'N/A'} | Time: ${new Date(log.timestamp).toLocaleString()}
                <br>Remarks: ${log.remarks || 'None'}
            </div>
        `).join('');

        container.innerHTML = logsHtml;
    }

    // Force sync
    async forceSync() {
        try {
            const result = await api.forceSync();
            this.showError(`✅ ${result.message}`, false);
            this.loadOverview(); // Refresh overview
        } catch (error) {
            this.showError('Force sync failed: ' + error.message);
        }
    }

    // Show error message
    showError(message, isError = true) {
        // Create temporary notification
        const notification = document.createElement('div');
        notification.className = `result-item ${isError ? 'result-error' : 'result-success'}`;
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.zIndex = '1000';
        notification.style.maxWidth = '400px';
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 5000);
    }

    // Cleanup
    destroy() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
    }
}

// Export dashboard instance
const dashboard = new Dashboard();