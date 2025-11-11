# AirLink System Memory Bank

## System Overview
AirLink is a smart bracelet-based boarding verification system for airports that synchronizes passenger and flight data between wearable devices, local servers, and central dashboards.

## Core Components

### 1. Bracelet Device (Edge Node)
- **Purpose**: Stores passenger & flight data temporarily, handles local verification
- **Technology**: Embedded microcontroller, EEPROM storage, BLE/Wi-Fi communication
- **Key Data**: Flight_ID, Passenger_ID, Boarding_Status, Device_ID, Token
- **Security**: Unique Device_ID and Token, firmware locked, reset by authorized personnel only

### 2. AirLink Server (Central Node)
- **Purpose**: Main application logic, MySQL database management, REST API handling
- **Technology**: Web Server (Tomcat/Nginx), MySQL Database, REST API service
- **Functions**: Synchronizes with bracelets, serves dashboard APIs, manages data integrity
- **Security**: Restricted DB access, encrypted communication, input validation

### 3. Web Dashboard (Client Node)
- **Purpose**: Admin interface for monitoring flight and boarding status
- **Access**: Role-based (Admin/Operator), session management, MFA recommended
- **Features**: Flight status display, boarding reports, sync logs, system overview

## Database Schema

### Core Tables
- **bookings**: Passenger flight reservations and details
- **bracelets**: Device information, assignment status, sync data
- **sync_logs**: Synchronization attempts, status, timestamps
- **servers**: Server configuration and status information

## API Endpoints (Priority-Based)

### P1 - Critical Operations
- `POST /bookings` - Create flight booking
- `POST /bracelets/assign` - Assign bracelet to passenger
- `POST /bracelets/verify` - Verify boarding eligibility

### P2-P9 - Supporting Operations
- Booking retrieval, bracelet status updates, deactivation
- System overview, sync logs, manual synchronization

## Data Flow Architecture

### Primary Flow
1. **Data Entry**: Airport database → AirLink Server → Bracelet
2. **Verification**: Bracelet → Server (boarding verification + sync)
3. **Monitoring**: Server → Web Dashboard (status & reports)

### Sync Process
- Bracelet stores data locally (Flight_ID, Passenger_ID, Boarding_Status)
- RFID/BLE scanner detects bracelet at gate
- System matches bracelet data with server records
- Server updates boarding status and syncs with bracelet

## Security Framework

### Authentication & Access Control
- Admin login with role-based access (Admin/Operator)
- SHA-256 password hashing, session timeout
- Unique Device_ID and Token per bracelet
- API key/token validation for all requests

### Data Protection
- **In Transit**: HTTPS for dashboard-server, encrypted BLE/Wi-Fi for bracelet-server
- **At Rest**: AES-128 encryption, normalized database storage
- **Integrity**: Flight_ID + Passenger_ID matching, timestamp verification

### Operational Security
- Input sanitization (SQL injection/XSS prevention)
- Comprehensive logging with timestamps
- Minimal error exposure, secure error handling
- Regular backups and patching

## Key Business Rules

### Bracelet Assignment
- One bracelet per passenger per flight
- Bracelet must be activated before boarding
- Deactivation required after boarding completion

### Sync Requirements
- Real-time synchronization between bracelet and server
- Offline queue capability with reconnection sync
- Traceability via Sync_ID for all records

### Verification Logic
- Bracelet data must match server records exactly
- Boarding status updates in real-time
- Failed verifications flagged for admin review

## Technical Specifications

### Communication Protocols
- **Dashboard ↔ Server**: HTTPS REST API
- **Bracelet ↔ Server**: Encrypted BLE/Wi-Fi
- **Data Format**: JSON for API responses, normalized SQL for storage

### Performance Requirements
- Real-time boarding verification
- Concurrent multi-bracelet support
- Dashboard responsive updates
- Offline resilience with sync recovery

## Deployment Architecture
- **Edge Layer**: Bracelet devices with local storage
- **Processing Layer**: AirLink Server with MySQL database
- **Presentation Layer**: Web dashboard with admin interface
- **Security Layer**: Encryption, authentication, and monitoring across all layers

## Monitoring & Maintenance
- Sync log analysis for failed attempts
- System overview dashboard for operational status
- Manual sync capability for troubleshooting
- Regular security audits and updates