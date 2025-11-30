# AirLink System - All UI Access Links

## 🌐 Local Access (Same Computer)

### Main Dashboard
- **Admin Dashboard**: http://localhost:3000/
- **Direct Link**: http://localhost:3000/frontend/src/index.html

### Bracelet Simulators (Live v3)
- **GES001**: http://localhost:3000/bracelet/simulator/live/bracelet-simulator-ges001-live-v3.html
- **GES002**: http://localhost:3000/bracelet/simulator/live/bracelet-simulator-ges002-live-v3.html
- **GES003**: http://localhost:3000/bracelet/simulator/live/bracelet-simulator-ges003-live-v3.html
- **GES004**: http://localhost:3000/bracelet/simulator/live/bracelet-simulator-ges004-live-v3.html
- **GES005**: http://localhost:3000/bracelet/simulator/live/bracelet-simulator-ges005-live-v3.html
- **GES006**: http://localhost:3000/bracelet/simulator/live/bracelet-simulator-ges006-live-v3.html
- **GES007**: http://localhost:3000/bracelet/simulator/live/bracelet-simulator-ges007-live-v3.html
- **GES008**: http://localhost:3000/bracelet/simulator/live/bracelet-simulator-ges008-live-v3.html
- **GES009**: http://localhost:3000/bracelet/simulator/live/bracelet-simulator-ges009-live-v3.html

### Gate Scanners
- **Assignment Scanner**: http://localhost:3000/bracelet/gate-scanner/assignment-scanner.html
- **General Scanner**: http://localhost:3000/bracelet/gate-scanner/scanner-app.html

---

## 🌍 Network Access (Other Devices on Same WiFi/LAN)

**Replace `192.168.0.160` with your actual IP address**

### Main Dashboard
- **Admin Dashboard**: http://192.168.0.160:3000/
- **Direct Link**: http://192.168.0.160:3000/frontend/src/index.html

### Bracelet Simulators (Live v3)
- **GES001**: http://192.168.0.160:3000/bracelet/simulator/live/bracelet-simulator-ges001-live-v3.html
- **GES002**: http://192.168.0.160:3000/bracelet/simulator/live/bracelet-simulator-ges002-live-v3.html
- **GES003**: http://192.168.0.160:3000/bracelet/simulator/live/bracelet-simulator-ges003-live-v3.html
- **GES004**: http://192.168.0.160:3000/bracelet/simulator/live/bracelet-simulator-ges004-live-v3.html
- **GES005**: http://192.168.0.160:3000/bracelet/simulator/live/bracelet-simulator-ges005-live-v3.html
- **GES006**: http://192.168.0.160:3000/bracelet/simulator/live/bracelet-simulator-ges006-live-v3.html
- **GES007**: http://192.168.0.160:3000/bracelet/simulator/live/bracelet-simulator-ges007-live-v3.html
- **GES008**: http://192.168.0.160:3000/bracelet/simulator/live/bracelet-simulator-ges008-live-v3.html
- **GES009**: http://192.168.0.160:3000/bracelet/simulator/live/bracelet-simulator-ges009-live-v3.html

### Gate Scanners
- **Assignment Scanner**: http://192.168.0.160:3000/bracelet/gate-scanner/assignment-scanner.html
- **Gate G1 Scanner**: http://192.168.0.160:3000/bracelet/gate-scanner/gate-g1-scanner.html
- **General Scanner**: http://192.168.0.160:3000/bracelet/gate-scanner/scanner-app.html

---

## 🔧 API Endpoints (For Testing)

### Health Check
- http://localhost:3000/api/health
- http://192.168.0.160:3000/api/health

### Authentication
- **Login**: POST http://localhost:3000/api/auth/login
- **Verify**: GET http://localhost:3000/api/auth/verify

### Admin
- **Overview**: GET http://localhost:3000/api/admin/overview
- **Sync Logs**: GET http://localhost:3000/api/admin/sync_logs

---

## 📱 Default Login Credentials

- **Admin**: 
  - Username: `admin`
  - Password: `admin12354`

- **Operator**: 
  - Username: `operator`
  - Password: `operator123`

---

## 📝 Notes

1. **Firewall**: Run `allow-network-access.bat` as Administrator to enable network access
2. **Server**: Must be running with `npm start` in backend folder
3. **Database**: MySQL must be running with `airlink_dev` database
4. **Network**: All devices must be on the same WiFi/LAN network
5. **IP Address**: Check your IP with `ipconfig` command

---

## 🚀 Quick Start

1. Start MySQL server
2. Run: `cd backend && npm start`
3. Open: http://localhost:3000/
4. Login with admin credentials
5. Access bracelet simulators and scanners from the links above
