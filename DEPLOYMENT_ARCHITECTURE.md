# AirLink System - Deployment Architecture

## Current System Architecture (v1.0)

### 🏢 Local Airport Deployment
The AirLink system runs **entirely on local airport infrastructure**:

```
┌─────────────────────────────────────────┐
│           AIRPORT LOCAL NETWORK          │
├─────────────────────────────────────────┤
│  ┌─────────────────┐  ┌───────────────┐ │
│  │  AirLink Server │  │ MySQL Database│ │
│  │  (Backend API)  │  │ (Local Storage)│ │
│  │  Port: 3000     │  │ Port: 3306    │ │
│  └─────────────────┘  └───────────────┘ │
│           │                             │
│  ┌─────────────────┐                    │
│  │ Web Dashboard   │                    │
│  │ (Frontend)      │                    │
│  │ Port: 8080      │                    │
│  └─────────────────┘                    │
│           │                             │
│  ┌─────────────────┐                    │
│  │ Bracelet Devices│                    │
│  │ (RFID/NFC/WiFi) │                    │
│  └─────────────────┘                    │
└─────────────────────────────────────────┘
                    │
            ┌───────▼───────┐
            │ Airline API   │
            │ (External)    │
            │ Flight Data   │
            └───────────────┘
```

### 🔌 External Connections
**ONLY** external connection:
- **Airline API** → AirLink Server (flight data import)
- All other operations are **local-only**

### 🚫 No Cloud Dependencies
- No internet required for core operations
- No external hosting services
- No cloud databases
- Self-contained airport system

### 💾 Local Components
- **Backend**: Node.js server on airport LAN
- **Database**: MySQL on local server
- **Frontend**: Served from local web server
- **Bracelets**: Connect via local WiFi/Bluetooth

### 🔄 Data Flow
1. **Airline API** → Local AirLink Server (flight import)
2. **Check-in Staff** → Local Dashboard (bracelet assignment)
3. **Bracelets** ↔ Local Server (verification & sync)
4. **Admin** → Local Dashboard (monitoring)

This ensures **complete airport control** and **no external dependencies** for daily operations.