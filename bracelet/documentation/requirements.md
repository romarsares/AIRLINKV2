# AirLink Bracelet Device Application

## Overview
The physical IoT bracelet device that passengers wear, containing flight information and enabling boarding verification through RFID/NFC scanning.

## Hardware Requirements
- **Microcontroller**: ESP32 or Arduino with Wi-Fi capability
- **Display**: OLED/LCD screen (128x64 or similar)
- **Communication**: RFID/NFC module for gate scanning
- **Connectivity**: Wi-Fi for server synchronization
- **Power**: Rechargeable battery with charging port
- **Indicators**: LED lights for status indication

## Device Functions

### 1. **Data Storage**
- Passenger name and ID
- Flight number and destination
- Seat number and gate information
- Boarding status (Pending/Cleared/Boarded)
- Battery level and sync status

### 2. **Display Interface**
```
┌─────────────────────┐
│ AIRLINK BRACELET    │
│                     │
│ John Doe            │
│ Flight: PR123       │
│ Gate: A12  Seat: 15A│
│ Status: CLEARED     │
│                     │
│ Battery: 85%        │
│ Sync: ✓ Connected   │
└─────────────────────┘
```

### 3. **Status Indicators**
- **Green LED**: Boarding cleared
- **Red LED**: Boarding denied/error
- **Blue LED**: Syncing with server
- **Orange LED**: Low battery warning

### 4. **Communication Protocol**
- **Wi-Fi**: Sync with AirLink server
- **RFID/NFC**: Gate scanner communication
- **Bluetooth**: Optional mobile app pairing

## Required Development

### Phase 1: Basic Firmware
- Display passenger and flight information
- Store data in local memory (EEPROM)
- Basic LED status indicators
- Battery monitoring

### Phase 2: Communication
- Wi-Fi connection to AirLink server
- Data synchronization protocols
- RFID/NFC response for gate scanners
- Error handling and offline mode

### Phase 3: Advanced Features
- Real-time flight updates
- Boarding notifications
- Security encryption
- Remote configuration

## Integration with AirLink System

### API Endpoints Used:
- `GET /api/bracelets/{bracelet_id}/status` - Get current status
- `PUT /api/bracelets/{bracelet_id}/sync` - Sync data with server
- `POST /api/bracelets/verify` - Boarding verification

### Data Flow:
1. **Assignment**: Staff assigns bracelet via dashboard
2. **Sync**: Bracelet downloads passenger/flight data
3. **Display**: Shows information to passenger
4. **Verification**: Gate scanner reads bracelet RFID
5. **Update**: Boarding status updated in real-time

## File Structure Needed:
```
bracelet-device/
├── firmware/
│   ├── main.cpp           # Main application code
│   ├── display.cpp        # Screen management
│   ├── wifi.cpp           # Wi-Fi communication
│   ├── rfid.cpp           # RFID/NFC handling
│   └── config.h           # Hardware configuration
├── libraries/             # Required libraries
├── schematics/           # Hardware wiring diagrams
└── documentation/        # Setup and usage guides
```

## Next Steps:
1. **Hardware Selection**: Choose microcontroller and components
2. **Firmware Development**: Write embedded C/C++ code
3. **Testing**: Prototype with breadboard setup
4. **Integration**: Connect with existing AirLink backend
5. **Production**: PCB design and manufacturing

**Status**: Not yet implemented - requires embedded systems development