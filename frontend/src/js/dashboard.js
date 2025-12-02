// Dashboard Module
class Dashboard {
    constructor() {
        this.currentSection = 'overview';
        this.refreshInterval = null;
        this.realTimeInterval = null;
        this.activityLog = [];
        this.previousBraceletStates = new Map();
        this.isRealTimeActive = false;
    }

    // Initialize dashboard
    init() {
        // Check authentication first
        if (!auth.requireAuth()) {
            return; // Will redirect to login
        }
        
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
        } else if (sectionName === 'flights') {
            this.loadFlights();
        } else if (sectionName === 'bookings') {
            this.loadBookings();
        } else if (sectionName === 'passengers') {
            this.loadPassengers();
        } else if (sectionName === 'bracelets') {
            this.loadDeviceStatus();
            this.startRealTimeUpdates();
        } else if (sectionName === 'logs') {
            this.loadSyncLogs();
        } else {
            this.stopRealTimeUpdates();
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
        document.getElementById('refreshBookings').addEventListener('click', () => this.loadBookings());
        document.getElementById('searchBookingBtn').addEventListener('click', () => this.searchBookings());
        document.getElementById('bookingSearch').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchBookings();
        });
        document.getElementById('statusFilter').addEventListener('change', () => this.filterBookings());
        document.getElementById('braceletFilter').addEventListener('change', () => this.filterBookings());

        // Flights
        document.getElementById('refreshFlights').addEventListener('click', () => this.loadFlights());

        // Passengers
        document.getElementById('refreshPassengers').addEventListener('click', () => this.loadPassengers());
        document.getElementById('searchPassengerBtn').addEventListener('click', () => this.searchPassengers());
        document.getElementById('passengerSearch').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchPassengers();
        });
        document.getElementById('passengerSort').addEventListener('change', () => this.sortPassengers());

        // Bracelets
        document.getElementById('assignBtn').addEventListener('click', () => this.assignBracelet());
        document.getElementById('verifyBtn').addEventListener('click', () => this.verifyBracelet());
        document.getElementById('statusBtn').addEventListener('click', () => this.checkBraceletStatus());
        document.getElementById('refreshBracelets').addEventListener('click', () => this.loadDeviceStatus());
        document.getElementById('activityFilter').addEventListener('change', () => this.filterActivityLog());
        document.getElementById('clearLog').addEventListener('click', () => this.clearActivityLog());

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
            document.getElementById('totalBookings').textContent = data.totalBookings || 0;
            document.getElementById('activeFlights').textContent = data.todayFlights || 0;
            document.getElementById('activeBracelets').textContent = data.activeBracelets || 0;
            document.getElementById('recentSyncs').textContent = data.connectedBracelets || 0;
        } catch (error) {
            console.error('Overview load error:', error);
            this.showError('Failed to load overview: ' + error.message);
            // Set default values on error
            document.getElementById('totalBookings').textContent = '0';
            document.getElementById('activeFlights').textContent = '0';
            document.getElementById('activeBracelets').textContent = '0';
            document.getElementById('recentSyncs').textContent = '0';
        }
    }

    // Load flights
    async loadFlights() {
        try {
            const flights = await api.getAllFlights();
            this.displayFlights(flights || []);
        } catch (error) {
            console.error('Flights load error:', error);
            this.showError('Failed to load flights: ' + error.message);
        }
    }

    // Display flights table
    displayFlights(flights) {
        const tbody = document.getElementById('flightsTableBody');
        
        if (flights.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="no-data">No flights found</td></tr>';
            return;
        }
        
        const rows = flights.map(flight => {
            const statusClass = flight.status === 'Boarding' ? 'boarding' : 
                               flight.status === 'Departed' ? 'departed' : 'scheduled';
            const departureTime = new Date(flight.departure_time).toLocaleString();
            
            return `
                <tr>
                    <td><strong>${flight.flight_no}</strong></td>
                    <td>${flight.destination}</td>
                    <td>${departureTime}</td>
                    <td><span class="gate-badge">${flight.gate_no}</span></td>
                    <td><span class="status-badge ${statusClass}">${flight.status}</span></td>
                    <td>${flight.total_passengers || 0}</td>
                    <td>${flight.boarded_count || 0}</td>
                </tr>
            `;
        }).join('');
        
        tbody.innerHTML = rows;
    }

    // Load passengers
    async loadPassengers() {
        try {
            const passengers = await api.getAllPassengers();
            this.allPassengers = passengers || [];
            this.displayPassengers(this.allPassengers);
        } catch (error) {
            console.error('Passengers load error:', error);
            this.showError('Failed to load passengers: ' + error.message);
        }
    }

    // Search passengers
    searchPassengers() {
        const searchTerm = document.getElementById('passengerSearch').value.toLowerCase().trim();
        
        if (!searchTerm) {
            this.displayPassengers(this.allPassengers);
            return;
        }
        
        const filtered = this.allPassengers.filter(passenger => 
            (passenger.name || '').toLowerCase().includes(searchTerm) ||
            (passenger.email || '').toLowerCase().includes(searchTerm) ||
            (passenger.flight_no || '').toLowerCase().includes(searchTerm) ||
            (passenger.nationality || '').toLowerCase().includes(searchTerm)
        );
        
        this.displayPassengers(filtered);
    }

    // Sort passengers
    sortPassengers() {
        const sortBy = document.getElementById('passengerSort').value;
        const searchTerm = document.getElementById('passengerSearch').value.toLowerCase().trim();
        
        let passengersToSort = searchTerm ? 
            this.allPassengers.filter(passenger => 
                (passenger.name || '').toLowerCase().includes(searchTerm) ||
                (passenger.email || '').toLowerCase().includes(searchTerm) ||
                (passenger.flight_no || '').toLowerCase().includes(searchTerm) ||
                (passenger.nationality || '').toLowerCase().includes(searchTerm)
            ) : this.allPassengers;
        
        const sorted = [...passengersToSort].sort((a, b) => {
            let aVal = '', bVal = '';
            
            switch(sortBy) {
                case 'name':
                    aVal = (a.name || '').toLowerCase();
                    bVal = (b.name || '').toLowerCase();
                    break;
                case 'flight':
                    aVal = (a.flight_no || '').toLowerCase();
                    bVal = (b.flight_no || '').toLowerCase();
                    break;
                case 'status':
                    aVal = (a.booking_status || '').toLowerCase();
                    bVal = (b.booking_status || '').toLowerCase();
                    break;
                case 'nationality':
                    aVal = (a.nationality || '').toLowerCase();
                    bVal = (b.nationality || '').toLowerCase();
                    break;
            }
            
            return aVal.localeCompare(bVal);
        });
        
        this.displayPassengers(sorted);
    }

    // Display passengers table
    displayPassengers(passengers) {
        const tbody = document.getElementById('passengersTableBody');
        
        if (passengers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="no-data">No passengers found</td></tr>';
            return;
        }
        
        const rows = passengers.map(passenger => {
            const statusClass = passenger.booking_status === 'Boarded' ? 'boarded' : 
                               passenger.booking_status === 'Confirmed' ? 'confirmed' : 'pending';
            
            return `
                <tr>
                    <td>${passenger.passenger_id}</td>
                    <td><strong>${passenger.name}</strong></td>
                    <td>${passenger.email || 'N/A'}</td>
                    <td>${passenger.contact_no || 'N/A'}</td>
                    <td>${passenger.nationality || 'N/A'}</td>
                    <td>${passenger.flight_no || 'No booking'}</td>
                    <td>${passenger.gate_no ? `<span class="gate-badge">${passenger.gate_no}</span>` : 'N/A'}</td>
                    <td>${passenger.assigned_bracelet || 'Not assigned'}</td>
                    <td><span class="status-badge ${statusClass}">${passenger.booking_status || 'No booking'}</span></td>
                </tr>
            `;
        }).join('');
        
        tbody.innerHTML = rows;
    }

    // Start real-time updates
    startRealTimeUpdates() {
        if (this.isRealTimeActive) return;
        
        this.isRealTimeActive = true;
        this.updateRealTimeStatus('🟢 Real-time Active');
        
        // Continuous polling every 2 seconds for real-time updates
        this.realTimeInterval = setInterval(() => {
            if (this.currentSection === 'bracelets' && this.isRealTimeActive) {
                this.loadDeviceStatus();
            }
        }, 2000);
        
        this.addBraceletLog('SYSTEM', 'Real-time Mode', 'Real-time monitoring activated - Updates every 2 seconds');
    }

    // Stop real-time updates
    stopRealTimeUpdates() {
        if (!this.isRealTimeActive) return;
        
        this.isRealTimeActive = false;
        this.updateRealTimeStatus('🔴 Real-time Inactive');
        
        if (this.realTimeInterval) {
            clearInterval(this.realTimeInterval);
            this.realTimeInterval = null;
        }
        
        this.addBraceletLog('SYSTEM', 'Real-time Mode', 'Real-time monitoring deactivated');
    }

    // Update real-time status indicator
    updateRealTimeStatus(status) {
        const statusElement = document.getElementById('realTimeStatus');
        if (statusElement) {
            statusElement.textContent = status;
        }
    }

    // Load device status
    async loadDeviceStatus() {
        try {
            const data = await api.getAllBracelets();
            this.trackBraceletChanges(data || []);
            this.displayDeviceStatus(data || []);
        } catch (error) {
            console.error('Device status load error:', error);
            this.showError('Failed to load device status: ' + error.message);
            this.addActivityLog('System Error', `Failed to load bracelet status: ${error.message}`, 'error');
        }
    }

    // Track bracelet state changes
    trackBraceletChanges(currentBracelets) {
        currentBracelets.forEach(bracelet => {
            const braceletId = bracelet.bracelet_id;
            const previousState = this.previousBraceletStates.get(braceletId);
            const isConnected = bracelet.connection_status === 'Connected';
            
            if (!previousState) {
                // First time seeing this bracelet - only log if actually connected
                if (isConnected) {
                    this.addBraceletLog(braceletId, 'Connected', `Bracelet ${braceletId} connected to server`);
                    
                    if (bracelet.passenger_name) {
                        this.addBraceletLog(braceletId, 'Assigned', `Assigned to ${bracelet.passenger_name}`);
                    }
                }
            } else {
                // Check for status changes
                if (previousState.status !== bracelet.status) {
                    this.addBraceletLog(braceletId, 'Status Change', `Status: ${previousState.status} → ${bracelet.status}`);
                }
                
                // Check for booking status changes (boarding)
                if (previousState.booking_status !== bracelet.booking_status) {
                    if (bracelet.booking_status === 'Boarded') {
                        this.addBraceletLog(braceletId, 'BOARDED', `✅ Passenger ${bracelet.passenger_name} has boarded flight ${bracelet.flight_no}`);
                    } else if (bracelet.booking_status === 'Confirmed') {
                        this.addBraceletLog(braceletId, 'Confirmed', `Booking confirmed for ${bracelet.passenger_name}`);
                    }
                }
                
                // Check for assignment changes
                if (previousState.passenger_name !== bracelet.passenger_name) {
                    if (bracelet.passenger_name && !previousState.passenger_name) {
                        this.addBraceletLog(braceletId, 'Assigned', `Assigned to ${bracelet.passenger_name}`);
                    } else if (!bracelet.passenger_name && previousState.passenger_name) {
                        this.addBraceletLog(braceletId, 'Unassigned', `Unassigned from ${previousState.passenger_name}`);
                    } else if (bracelet.passenger_name !== previousState.passenger_name) {
                        this.addBraceletLog(braceletId, 'Reassigned', `Reassigned from ${previousState.passenger_name} to ${bracelet.passenger_name}`);
                    }
                }
                
                // Check for sync time changes (indicates connection) - only log if meaningful change
                if (bracelet.last_sync_time !== previousState.last_sync_time && 
                    (bracelet.passenger_name || previousState.passenger_name || 
                     bracelet.status !== previousState.status)) {
                    this.addBraceletLog(braceletId, 'Sync', `Synchronized with server`);
                }
                
                // Check for battery level changes
                if (Math.abs((bracelet.battery_level || 0) - (previousState.battery_level || 0)) >= 5) {
                    const batteryStatus = bracelet.battery_level < 20 ? ' (LOW BATTERY!)' : '';
                    this.addBraceletLog(braceletId, 'Battery Update', `Battery: ${bracelet.battery_level}%${batteryStatus}`);
                }
            }
            
            // Update stored state
            this.previousBraceletStates.set(braceletId, {
                status: bracelet.status,
                passenger_name: bracelet.passenger_name,
                last_sync_time: bracelet.last_sync_time,
                battery_level: bracelet.battery_level,
                flight_no: bracelet.flight_no,
                booking_status: bracelet.booking_status
            });
        });
        
        // Check for disconnected bracelets
        const currentIds = new Set(currentBracelets.map(b => b.bracelet_id));
        for (const [braceletId, previousState] of this.previousBraceletStates) {
            if (!currentIds.has(braceletId)) {
                this.addBraceletLog(braceletId, 'Disconnected', `Bracelet ${braceletId} lost connection`);
                this.previousBraceletStates.delete(braceletId);
            }
        }
    }

    // Add bracelet-specific log entry
    addBraceletLog(braceletId, action, details) {
        const timestamp = new Date().toLocaleTimeString();
        const entry = {
            timestamp,
            action: `${braceletId} ${action}`,
            details,
            type: this.getBraceletLogType(action),
            braceletId,
            id: Date.now() + Math.random()
        };
        
        this.activityLog.unshift(entry);
        
        // Keep only last 200 entries
        if (this.activityLog.length > 200) {
            this.activityLog = this.activityLog.slice(0, 200);
        }
        
        this.updateActivityLogDisplay();
    }

    // Get log type based on action
    getBraceletLogType(action) {
        const lowerAction = action.toLowerCase();
        if (lowerAction.includes('error') || lowerAction.includes('disconnected') || lowerAction.includes('denied') || lowerAction.includes('low battery')) {
            return 'error';
        } else if (lowerAction.includes('assigned') || lowerAction.includes('connected') || lowerAction.includes('cleared') || lowerAction.includes('boarding') || lowerAction.includes('boarded')) {
            return 'success';
        } else {
            return 'info';
        }
    }

    // Display device status table
    displayDeviceStatus(bracelets) {
        // Update summary counts
        const synced = bracelets.filter(b => b.connection_status === 'Connected').length;
        const unsynced = bracelets.filter(b => b.connection_status === 'Disconnected').length;
        const active = bracelets.filter(b => b.status === 'Active').length;
        const inactive = bracelets.filter(b => b.status === 'Inactive').length;
        
        document.getElementById('syncedCount').textContent = synced;
        document.getElementById('unsyncedCount').textContent = unsynced;
        document.getElementById('activeCount').textContent = active;
        document.getElementById('inactiveCount').textContent = inactive;
        
        // Update table
        const tbody = document.getElementById('deviceTableBody');
        
        if (bracelets.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="no-data">No bracelets found</td></tr>';
            return;
        }
        
        const rows = bracelets.map(bracelet => {
            const connectionClass = bracelet.connection_status === 'Connected' ? 'connected' : 'disconnected';
            const statusClass = bracelet.status === 'Active' ? 'active' : 'inactive';
            const lastSync = bracelet.last_sync_time ? new Date(bracelet.last_sync_time).toLocaleString() : 'Never';
            
            return `
                <tr>
                    <td><strong>${bracelet.bracelet_id}</strong></td>
                    <td><span class="status-badge ${statusClass}">${bracelet.status}</span></td>
                    <td>${bracelet.battery_level || 0}%</td>
                    <td>${lastSync}</td>
                    <td><span class="connection-badge ${connectionClass}">${bracelet.connection_status}</span></td>
                    <td>${bracelet.passenger_name || 'Unassigned'}</td>
                    <td>
                        <button class="btn-small" data-bracelet-id="${bracelet.bracelet_id}" data-action="sync">Sync</button>
                        <button class="btn-small btn-danger" data-bracelet-id="${bracelet.bracelet_id}" data-action="deactivate">Deactivate</button>
                    </td>
                </tr>
            `;
        }).join('');
        
        tbody.innerHTML = rows;
        
        // Add event listeners for action buttons
        tbody.querySelectorAll('[data-action="sync"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const braceletId = e.target.dataset.braceletId;
                this.syncBracelet(braceletId);
            });
        });
        
        tbody.querySelectorAll('[data-action="deactivate"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const braceletId = e.target.dataset.braceletId;
                this.deactivateBracelet(braceletId);
            });
        });
    }

    // Sync individual bracelet
    async syncBracelet(braceletId) {
        try {
            this.addBraceletLog(braceletId, 'Manual Sync', 'Initiating manual synchronization...');
            await api.syncBracelet(braceletId);
            this.showError(`✅ Bracelet ${braceletId} synced successfully`, false);
            this.addBraceletLog(braceletId, 'Sync Complete', 'Manual synchronization completed successfully');
            
            // Refresh after a short delay
            setTimeout(() => this.loadDeviceStatus(), 1000);
        } catch (error) {
            this.showError(`Failed to sync bracelet ${braceletId}: ${error.message}`);
            this.addBraceletLog(braceletId, 'Sync Failed', error.message);
        }
    }

    // Deactivate individual bracelet
    async deactivateBracelet(braceletId) {
        if (!confirm(`Are you sure you want to deactivate bracelet ${braceletId}?`)) {
            return;
        }
        
        try {
            await api.deactivateBracelet(braceletId);
            this.showError(`✅ Bracelet ${braceletId} deactivated successfully`, false);
            this.loadDeviceStatus(); // Refresh table
        } catch (error) {
            this.showError(`Failed to deactivate bracelet ${braceletId}: ${error.message}`);
        }
    }

    // Load all bookings
    async loadBookings() {
        try {
            const bookings = await api.getAllBookings();
            this.allBookings = bookings || [];
            this.displayBookings(this.allBookings);
        } catch (error) {
            console.error('Bookings load error:', error);
            this.showError('Failed to load bookings: ' + error.message);
        }
    }

    // Search bookings
    searchBookings() {
        this.filterBookings();
    }

    // Filter bookings
    filterBookings() {
        if (!this.allBookings) return;
        
        const searchTerm = document.getElementById('bookingSearch').value.toLowerCase().trim();
        const statusFilter = document.getElementById('statusFilter').value;
        const braceletFilter = document.getElementById('braceletFilter').value;
        
        let filtered = this.allBookings.filter(booking => {
            // Search filter
            const matchesSearch = !searchTerm || 
                booking.booking_id.toString().includes(searchTerm) ||
                (booking.passenger_name || '').toLowerCase().includes(searchTerm);
            
            // Status filter
            const matchesStatus = statusFilter === 'all' || booking.booking_status === statusFilter;
            
            // Bracelet filter
            let matchesBracelet = true;
            if (braceletFilter === 'assigned') {
                matchesBracelet = booking.assigned_bracelet !== null;
            } else if (braceletFilter === 'unassigned') {
                matchesBracelet = booking.assigned_bracelet === null;
            }
            
            return matchesSearch && matchesStatus && matchesBracelet;
        });
        
        this.displayBookings(filtered);
    }

    // Display bookings table
    displayBookings(bookings) {
        const tbody = document.getElementById('bookingsTableBody');
        
        if (bookings.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="no-data">No bookings found</td></tr>';
            return;
        }
        
        const rows = bookings.map(booking => {
            const statusClass = booking.booking_status === 'Boarded' ? 'boarded' : 
                               booking.booking_status === 'Confirmed' ? 'confirmed' : 'pending';
            
            return `
                <tr>
                    <td><strong>${booking.booking_id}</strong></td>
                    <td>${booking.passenger_name}</td>
                    <td>${booking.flight_no}</td>
                    <td>${booking.destination}</td>
                    <td>${booking.seat_no}</td>
                    <td><span class="status-badge ${statusClass}">${booking.booking_status}</span></td>
                    <td>${booking.assigned_bracelet || 'Not assigned'}</td>
                    <td>${booking.gate_no ? `<span class="gate-badge">${booking.gate_no}</span>` : 'N/A'}</td>
                </tr>
            `;
        }).join('');
        
        tbody.innerHTML = rows;
    }



    // Assign bracelet
    async assignBracelet() {
        const bookingId = document.getElementById('assignBookingId').value.trim();
        const braceletId = document.getElementById('assignBraceletId').value.trim();
        
        if (!bookingId || !braceletId) {
            this.showError('Please fill in both Booking ID and Bracelet ID');
            return;
        }

        try {
            // Get booking details first
            const booking = await api.getBooking(bookingId);
            const result = await api.assignBracelet(parseInt(bookingId), braceletId);
            
            this.showError(`✅ ${result.message}`, false);
            this.addBraceletLog(braceletId, 'Assignment', `Manually assigned to ${booking.passenger_name} (${booking.flight_no})`);
            this.clearBraceletInputs();
            
            // Refresh after a short delay to catch the assignment
            setTimeout(() => this.loadDeviceStatus(), 1000);
        } catch (error) {
            this.showError(`❌ ${error.message}`);
            this.addBraceletLog(braceletId, 'Assignment Failed', error.message);
        }
    }

    // Verify bracelet
    async verifyBracelet() {
        const braceletId = document.getElementById('verifyBraceletId').value.trim();
        const gateNo = document.getElementById('verifyGateNo').value.trim();
        
        if (!braceletId || !gateNo) {
            this.showError('Please fill in both Bracelet ID and Gate Number');
            return;
        }

        try {
            this.addBraceletLog(braceletId, 'Gate Scan', `Scanned at Gate ${gateNo} for boarding verification`);
            
            const result = await api.verifyBracelet(braceletId, gateNo);
            if (result.verified) {
                this.showError(`✅ Boarding Cleared - ${result.flight_no}`, false);
                this.addBraceletLog(braceletId, 'Boarding Cleared', `✅ Approved for boarding ${result.flight_no} at Gate ${gateNo}`);
            } else {
                this.showError(`❌ Boarding Denied - ${result.message}`);
                this.addBraceletLog(braceletId, 'Boarding Denied', `❌ ${result.message} at Gate ${gateNo}`);
            }
            this.clearBraceletInputs();
            
            // Refresh after a short delay
            setTimeout(() => this.loadDeviceStatus(), 1000);
        } catch (error) {
            this.showError(`❌ ${error.message}`);
            this.addBraceletLog(braceletId, 'Verification Error', error.message);
        }
    }

    // Check bracelet status
    async checkBraceletStatus() {
        const braceletId = document.getElementById('statusBraceletId').value.trim();
        
        if (!braceletId) {
            this.showError('Please enter Bracelet ID');
            return;
        }

        try {
            const result = await api.getBraceletStatus(braceletId);
            const status = result.data;
            this.showError(`Status: ${status.status} | Battery: ${status.battery_level}% | Last Sync: ${status.last_sync_time || 'Never'}`, false);
        } catch (error) {
            this.showError(`❌ ${error.message}`);
        }
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

    // Add activity log entry
    addActivityLog(action, details, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const entry = {
            timestamp,
            action,
            details,
            type,
            id: Date.now()
        };
        
        this.activityLog.unshift(entry); // Add to beginning
        
        // Keep only last 100 entries
        if (this.activityLog.length > 100) {
            this.activityLog = this.activityLog.slice(0, 100);
        }
        
        this.updateActivityLogDisplay();
    }

    // Update activity log display
    updateActivityLogDisplay() {
        const container = document.getElementById('activityLog');
        if (!container) return;
        
        const filter = document.getElementById('activityFilter')?.value || 'all';
        
        let filteredLog = this.activityLog;
        
        if (filter !== 'all') {
            filteredLog = this.activityLog.filter(entry => {
                const actionLower = entry.action.toLowerCase();
                switch(filter) {
                    case 'connections': 
                        return actionLower.includes('connected') || actionLower.includes('disconnected') || actionLower.includes('sync');
                    case 'assignments': 
                        return actionLower.includes('assigned') || actionLower.includes('unassigned') || actionLower.includes('reassigned');
                    case 'verifications': 
                        return actionLower.includes('boarding') || actionLower.includes('gate scan') || actionLower.includes('cleared') || actionLower.includes('denied');
                    case 'errors': 
                        return entry.type === 'error';
                    default: return true;
                }
            });
        }
        
        if (filteredLog.length === 0) {
            container.innerHTML = '<div class="log-entry log-empty">No bracelet activity found</div>';
            return;
        }
        
        const logsHtml = filteredLog.slice(0, 50).map(entry => `
            <div class="log-entry log-${entry.type}">
                <span class="log-time">${entry.timestamp}</span>
                <span class="log-action">${entry.action}</span>
                <span class="log-details">${entry.details}</span>
            </div>
        `).join('');
        
        container.innerHTML = logsHtml;
    }

    // Filter activity log
    filterActivityLog() {
        this.updateActivityLogDisplay();
    }

    // Clear activity log
    clearActivityLog() {
        this.activityLog = [];
        this.updateActivityLogDisplay();
        this.addActivityLog('Log cleared', 'Activity log has been cleared', 'info');
    }

    // Cleanup
    destroy() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        if (this.realTimeInterval) {
            clearInterval(this.realTimeInterval);
        }
        this.isRealTimeActive = false;
    }
}

// Export dashboard instance
const dashboard = new Dashboard();