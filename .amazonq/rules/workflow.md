System Purpose:
To provide a seamless communication link between airports, airlines, and passengers using a smart IoT bracelet that syncs real-time flight information, supports digital boarding, and enhances accessibility for all travelers.

🧩 1. System Architecture Diagram (Conceptual Flow)
Actors & Components:
Passenger / Airline Website / Ticketing Agent
Airport Check-in Counter / Self-Service Kiosk
AirLink Bracelet (IoT Device)
Local AirLink Server (Airport LAN)
Central Airline Server / Cloud Backup
Flow Summary:
[Passenger / Airline Website]
         │
         ▼
 [Airline Booking System] 
         │
     Booking Data (API)
         │
         ▼
 [AirLink Local Server] 
         │
   Bracelet Assignment
         │
         ▼
 [AirLink Bracelet] ⇆ [RFID/NFC/Wi-Fi Sync]
         │
         ▼
 [Security Gate Scanner]
         │
         ▼
 Boarding Verification → Local Server Logs → Central Airline Server
Purpose: Shows how data travels from booking → bracelet → verification → database.






 2. Use Case Diagram (Simplified)
Actors:
Passenger
Check-in Staff
Security / Boarding Staff
System Administrator
Use Cases:
Book Flight
Assign Bracelet
Verify Boarding
Monitor Bracelet Activity
Generate Reports
Sync Local to Cloud Data
✅ Example:
Passenger → [Book Flight], [Receive Bracelet Updates]
Check-in Staff → [Assign Bracelet], [Update Flight Details]
Security Staff → [Verify Bracelet for Boarding]
Admin → [Manage Users], [Generate Reports], [Sync Databases]
3. Entity Relationship Diagram (ERD)
Entity
Attributes
Relationships
Passenger
passenger_id, name, contact, nationality
1–M → FlightBooking
FlightBooking
booking_id, flight_no, seat_no, date_time, destination, status
M–1 → Passenger, 1–1 → Bracelet
Bracelet
bracelet_id, RFID_code, assigned_status, battery_status
1–1 → FlightBooking
CheckinLog
log_id, bracelet_id, timestamp, gate_no, status
M–1 → Bracelet
ServerSync
sync_id, local_server_id, timestamp, sync_status
M–1 → LocalServer

MySQL 8 or PostgreSQL recommended. Each airport has its Local AirLink Database, which periodically syncs to the Central Cloud Database.



 4. Frontend and Backend Stack
Layer
Recommended Tools
Frontend (Dashboard)
React.js or Vue.js (modern, airport-style dashboard)
Backend (API)
Node.js (Express) or Java Spring Boot
Database
MySQL 8
Communication
REST API / WebSocket (for real-time bracelet sync)
Bracelet Firmware
Arduino / ESP32 / Raspberry Pi Pico W (Wi-Fi + RFID/NFC)


5. System Modules
Module
Description
Booking Integration Module
Imports booking data from airline API
Bracelet Management
Assigns bracelets, activates/deactivates units
Security Verification
Validates bracelet data at boarding gates
Server Sync Engine
Syncs between local and cloud servers
Reporting & Analytics
Generates passenger logs, boarding stats, usage reports
Admin Console
User management, maintenance logs, update dashboard


6. Testing Phases
Phase
Objective
Unit Testing
Check bracelet assignment and verification logic
Integration Testing
Ensure sync between bracelet ↔ local ↔ central
User Acceptance Testing (UAT)
Conduct pilot in airport terminal
Performance Testing
Validate real-time communication speed
Security Testing
Verify RFID/NFC encryption and data safety



1. System Architecture Diagram (Text-Based)
┌───────────────────────────────────────────┐
│           Airline Booking System          │
│  (Passenger / Airline Website / Agent)    │
└───────────────────────────────────────────┘
                      │
          Flight Booking Details (API)
                      │
                      ▼
┌───────────────────────────────────────────┐
│           AirLink Local Server            │
│  (Located in Airport LAN Environment)     │
│───────────────────────────────────────────│
│  • Stores Flight & Bracelet Records       │
│  • Handles Bracelet Assignment            │
│  • Logs Boarding & Security Activities    │
│  • Periodically Syncs with Cloud Server   │
└───────────────────────────────────────────┘
                      │
          Bracelet Assignment / Sync
                      │
                      ▼
┌───────────────────────────────────────────┐
│           AirLink Bracelet Device         │
│  (IoT Wearable with RFID / NFC / Wi-Fi)   │
│───────────────────────────────────────────│
│  • Receives Flight No., Gate, Seat Info   │
│  • Displays / Vibrates / Alerts User      │
│  • Communicates with Local Server         │
│  • Verifies Boarding via RFID Scan        │
└───────────────────────────────────────────┘
                      │
        Boarding Verification Process
                      │
                      ▼
┌───────────────────────────────────────────┐
│       Security Gate / Boarding Staff      │
│───────────────────────────────────────────│
│  • Scans Bracelet via RFID/NFC Reader     │
│  • Sends Verification Request to Server   │
│  • Updates Boarding Status (Cleared/Fail) │
└───────────────────────────────────────────┘
                      │
          Data Logging & Sync Activity
                      │
                      ▼
┌───────────────────────────────────────────┐
│           Central Airline Server          │
│───────────────────────────────────────────│
│  • Consolidates Passenger Data            │
│  • Stores Airport Sync Logs               │
│  • Generates Reports & Analytics          │
└───────────────────────────────────────────┘

 2. Use Case Diagram (Text-Based)
Actors:
-------
1. Passenger
2. Check-in Staff
3. Security / Boarding Staff
4. System Administrator

Use Cases:
-----------

[Passenger]
  ├── Book Flight
  ├── Receive Bracelet Notification
  └── Tap Bracelet for Boarding Verification

[Check-in Staff]
  ├── Retrieve Booking Record
  ├── Assign Bracelet to Passenger
  ├── Map Bracelet ID to Flight Record
  └── Sync Bracelet Data to Local Server

[Security / Boarding Staff]
  ├── Verify Bracelet via RFID/NFC Scanner
  ├── Confirm Boarding Clearance
  └── Update Boarding Log in Server

[System Administrator]
  ├── Monitor Bracelet Activity
  ├── Manage Passenger and Flight Records
  ├── View System Logs and Reports
  ├── Handle Data Sync (Local ↔ Cloud)
  └── Maintain and Update System Configuration

Relationships:
---------------
Passenger → interacts with → Booking System, Bracelet Device
Check-in Staff → interacts with → Local AirLink Server
Security Staff → interacts with → Bracelet Device & Server
Admin → manages → Local Server, Cloud Server, Reports

🗂️ 3. Entity Relationship Diagram (ERD – Text-Based)
Entities and Relationships:
----------------------------

[PASSENGER]
- passenger_id (PK)
- full_name
- contact_number
- nationality
- email_address

Relationships:
- One Passenger can have multiple FlightBookings.

---------------------------------------------

[FLIGHT_BOOKING]
- booking_id (PK)
- passenger_id (FK)
- flight_no
- destination
- departure_time
- seat_no
- booking_status
- bracelet_id (FK)

Relationships:
- Each FlightBooking belongs to one Passenger.
- Each FlightBooking is assigned to one Bracelet.

---------------------------------------------

[BRACELET]
- bracelet_id (PK)
- rfid_code
- wifi_mac
- assigned_status
- battery_status
- last_sync_time

Relationships:
- One Bracelet can be linked to one FlightBooking.
- One Bracelet can have many CheckinLogs.

---------------------------------------------

[CHECKIN_LOG]
- log_id (PK)
- bracelet_id (FK)
- gate_no
- timestamp
- verification_status (Cleared / Failed)

Relationships:
- Each CheckinLog belongs to one Bracelet.

---------------------------------------------

[SERVER_SYNC]
- sync_id (PK)
- local_server_id
- sync_timestamp
- sync_status (Successful / Pending / Failed)

Relationships:
- Each Sync record refers to one LocalServer instance.

---------------------------------------------

[LOCAL_SERVER]
- local_server_id (PK)
- airport_name
- ip_address
- location
- last_sync_time

Relationships:
- One LocalServer can have many ServerSync records.

✅ Summary of Relationships:
PASSENGER (1) ────< (M) FLIGHT_BOOKING (1) ──── (1) BRACELET
BRACELET (1) ────< (M) CHECKIN_LOG
LOCAL_SERVER (1) ────< (M) SERVER_SYNC

AIRLINK SYSTEM DATA FLOW DIAGRAM

Context Diagram — AirLink System (Level 0 Overview)
                 +----------------------+
                 |      Passenger       |
                 |----------------------|
                 | - Book flight        |
                 | - Receive alerts     |
                 | - Tap bracelet       |
                 +----------+-----------+
                            |
                            | Booking Info / Status Updates
                            v
+-------------------------------------------------------------+
|                     AIRLINK SYSTEM                          |
|-------------------------------------------------------------|
|  • Process flight booking details                           |
|  • Assign and activate bracelet                             |
|  • Sync bracelet data with local/central servers            |
|  • Verify boarding at checkpoints                           |
|  • Generate logs and analytics                              |
+-------------------------------------------------------------+
                            ^
                            | Boarding & Sync Data
                            |
                 +-----------+------------+
                 |   Airport Check-In/    |
                 |   Security Staff       |
                 |------------------------|
                 | - Assign bracelet      |
                 | - Verify passengers    |
                 | - Collect bracelets    |
                 +-----------+------------+
                             |
                             | System Logs / Status Reports
                             v
                 +-----------------------------+
                 |  Central Airline Server     |
                 |-----------------------------|
                 | - Sync flight & passenger   |
                 |   data with AirLink system  |
                 | - Receive logs and reports  |
                 +-----------------------------+

🧩 Explanation (Focused and Within Scope)
Passenger — books a flight, wears the bracelet, receives updates and notifications.
Airport Staff — assigns bracelets during check-in, verifies passengers during boarding, and collects bracelets afterward.
Central Airline Server — provides flight and booking data, receives sync updates, and stores logs for reporting.
AirLink System (Main Process) — the core boundary that handles booking verification, bracelet assignment, synchronization, and status reporting between all parties.

LEVEL 0 – Context Diagram
External Entities:
------------------
1. Passenger
2. Airline Booking System
3. Check-in Staff
4. Security / Boarding Staff
5. Central Airline Server

Main Process:
-------------
[0] AIRLINK SYSTEM

Data Flows:
------------
Passenger → provides → Flight Booking Details → Airline Booking System  
Airline Booking System → sends → Booking Data → AirLink System  
Check-in Staff → assigns → Bracelet ID → AirLink System  
Security / Boarding Staff → verifies → Bracelet Scan Data → AirLink System  
AirLink System → syncs → Flight & Boarding Data → Central Airline Server  

Data Stores:
-------------
• Local AirLink Database (for Passenger, FlightBooking, Bracelet, Logs)

Output:
--------
AirLink System → provides → Boarding Verification, Bracelet Alerts, Reports

LEVEL 1 – Detailed Process Breakdown
Process [1.0]  Passenger Flight Booking
-------------------------------------------------
Input:
  - Passenger Details (Name, Flight No., Destination, Date/Time)
  - Booking Request

Steps:
  1. Receive booking request from Airline Booking System.
  2. Validate flight availability.
  3. Create Flight Booking Record (status: Pending Bracelet Assignment).

Data Flow:
  Passenger → Airline Booking System → AirLink System → [D1: FlightBooking]


Process [2.0]  Bracelet Assignment (Check-In)
-------------------------------------------------
Input:
  - Passenger Name or Booking Reference
  - Bracelet RFID / Device ID

Steps:
  1. Retrieve passenger booking record.
  2. Assign unique Bracelet ID.
  3. Store key details (Flight No., Gate, Seat No., Boarding Time).
  4. Update record as "Assigned" in the database.

Data Flow:
  Check-in Staff → AirLink System → [D2: Bracelet] → [D1: FlightBooking]


Process [3.0]  Boarding Verification
-------------------------------------------------
Input:
  - RFID/NFC Scan from Bracelet

Steps:
  1. Verify Bracelet ID and FlightBooking in Local Database.
  2. If valid → mark “Cleared for Boarding.”
  3. If invalid → log “Failed Verification.”
  4. Send confirmation feedback to Bracelet (LED/Vibration).

Data Flow:
  Bracelet → Security Staff → AirLink System → [D3: CheckinLog]


Process [4.0]  Server Data Handling & Sync
-------------------------------------------------
Input:
  - Local Activity Logs
  - Boarding and Bracelet Data

Steps:
  1. Log all bracelet activities (scan, check-in, boarding).
  2. Update Passenger and Flight Status in Local Server.
  3. Periodically sync local data with Central Airline Server.
  4. Generate summary reports and analytics.

Data Flow:
  [D3: CheckinLog], [D2: Bracelet], [D1: FlightBooking] 
    → AirLink System → [D4: ServerSync] → Central Airline Server


Process [5.0]  Bracelet Deactivation / Collection
-------------------------------------------------
Input:
  - Boarding Completion Trigger

Steps:
  1. Mark Bracelet as “Inactive.”
  2. Archive passenger boarding record for audit.
  3. Prepare bracelet for next assignment.

Data Flow:
  Boarding Staff → AirLink System → [D2: Bracelet], [D1: FlightBooking]

DATA STORES (Referenced Across All Processes)
[D1] FlightBooking
    - booking_id, passenger_id, flight_no, seat_no, departure_time, status

[D2] Bracelet
    - bracelet_id, rfid_code, assigned_status, battery_status

[D3] CheckinLog
    - log_id, bracelet_id, timestamp, gate_no, verification_status

[D4] ServerSync
    - sync_id, local_server_id, sync_timestamp, sync_status

SUMMARY OF DATA FLOW CONNECTIONS
Passenger → Airline Booking System → AirLink System → Local Database
Check-in Staff → AirLink System → Bracelet → Passenger
Security Staff → Bracelet Scan → AirLink System → Boarding Log
Local AirLink Server → Central Airline Server → Analytics / Reports

DFD LEVEL 2

Process 3.0 – Boarding Verification (Detailed)
External Entities:
------------------
• Security / Boarding Staff
• Bracelet Device (RFID / NFC)

Data Stores:
------------
[D1] FlightBooking
[D2] Bracelet
[D3] CheckinLog

Sub-Processes:
--------------
[3.1] Scan Bracelet
    - Input: RFID/NFC signal from Bracelet
    - Output: Bracelet_ID captured
    - Description: Bracelet is tapped or scanned at gate reader.

[3.2] Retrieve Bracelet & Booking Data
    - Input: Bracelet_ID
    - Output: Matched passenger record from database
    - Data Accessed: [D1: FlightBooking], [D2: Bracelet]
    - Description: System checks assigned passenger and flight details.

[3.3] Verify Booking Validity
    - Condition Check:
        IF Bracelet_ID matches valid booking → Proceed
        ELSE → Mark as “Failed Verification”
    - Output: Verification result (Cleared / Failed)

[3.4] Log Verification Result
    - Input: Verification result
    - Output: Record stored in [D3: CheckinLog]
    - Description: Every scan attempt (success/fail) is logged with timestamp, gate_no, and status.

[3.5] Send Feedback to Bracelet
    - Input: Verification result
    - Output: LED/Vibration Signal
    - Description: Bracelet responds with GREEN (Cleared) or RED (Failed).

Data Flow Summary:
------------------
Security Staff → [3.1] Scan Bracelet  
[3.1] → [3.2] Retrieve Bracelet & Booking Data → [D1], [D2]  
[3.2] → [3.3] Verify Booking Validity  
[3.3] → [3.4] Log Verification Result → [D3]  
[3.3] → [3.5] Send Feedback to Bracelet  

Process 4.0 – Server Data Handling & Sync (Detailed)
External Entities:
------------------
• Central Airline Server

Data Stores:
------------
[D1] FlightBooking
[D2] Bracelet
[D3] CheckinLog
[D4] ServerSync

Sub-Processes:
--------------
[4.1] Collect Activity Logs
    - Input: Check-in / Boarding activity from [D3: CheckinLog]
    - Output: Activity dataset ready for sync
    - Description: Gathers bracelet activity, timestamps, and passenger statuses.

[4.2] Update Passenger and Flight Status
    - Input: Activity logs
    - Process:
        IF verification_status = “Cleared”
            THEN set FlightBooking.status = “Boarded”
        ELSE retain as “Pending”
    - Output: Updated booking records in [D1: FlightBooking]

[4.3] Prepare Sync Package
    - Input: Updated FlightBooking, Bracelet, and CheckinLog data
    - Output: Temporary dataset for cloud upload
    - Description: Formats and compresses data for transmission.

[4.4] Transmit Data to Central Server
    - Input: Prepared Sync Package
    - Output: Sync Confirmation / Response
    - Description: Sends records via WAN or secure API connection.

[4.5] Log Sync Activity
    - Input: Sync status (Successful / Failed)
    - Output: New record in [D4: ServerSync]
    - Description: Records sync timestamp, server ID, and result for audit trail.

Data Flow Summary:
------------------
[D3: CheckinLog] → [4.1] Collect Activity Logs  
[4.1] → [4.2] Update Passenger & Flight Status → [D1: FlightBooking]  
[4.2] → [4.3] Prepare Sync Package → [4.4] Transmit Data to Central Server  
[4.4] → [4.5] Log Sync Activity → [D4: ServerSync]

✅ Summary of DFD Level 2
Process
Description
Key Data Stores
Output
3.0 Boarding Verification
Confirms bracelet and passenger match, logs result, and provides feedback
FlightBooking, Bracelet, CheckinLog
Boarding Verification Log, Bracelet Feedback
4.0 Server Data Handling & Sync
Updates flight records, syncs data with central server, and logs sync status







DFD Level 3 — Bracelet ↔ Server Communication Flow (Text Diagram Format)
+-------------------------------------------------------------+
|                      Passenger Bracelet                     |
|-------------------------------------------------------------|
| 1. Capture passenger ID and flight reference (via chip)     |
| 2. Temporarily store data in bracelet memory                |
| 3. Send data packet via wireless link                       |
+-------------------------|-----------------------------------+
                          |
                          v
+-------------------------------------------------------------+
|                Bracelet Data Receiver Module                |
|-------------------------------------------------------------|
| 4. Receive encoded bracelet data packet                     |
| 5. Validate transmission integrity (checksum / ID match)    |
| 6. Forward validated data to Sync Handler                   |
+-------------------------|-----------------------------------+
                          |
                          v
+-------------------------------------------------------------+
|                     Server Sync Handler                     |
|-------------------------------------------------------------|
| 7. Decode bracelet payload (Passenger ID, Flight Ref)       |
| 8. Cross-check with flight records in database              |
| 9. Log transaction (timestamp, device ID)                   |
|10. Update verification status in system logs                |
|11. Send acknowledgment (ACK) response to bracelet           |
+-------------------------|-----------------------------------+
                          |
                          v
+-------------------------------------------------------------+
|                  Bracelet Acknowledgment Unit               |
|-------------------------------------------------------------|
| 12. Receive ACK from server                                 |
| 13. Display sync success indicator (LED/Display alert)      |
| 14. Mark data as transmitted successfully                   |
+-------------------------------------------------------------+

Flow Summary:
Bracelet captures and sends passenger flight data.
Server receives, validates, and updates central records.
Bracelet confirms synchronization with visual feedback.

Sequence Diagram — Bracelet ↔ Server Communication
Actors:
[Passenger Bracelet]
[Bracelet Data Receiver]
[Server Sync Handler]
[Database]
[Bracelet Acknowledgment Unit]

---------------------------------------------------------------
1. [Passenger Bracelet] → [Bracelet Data Receiver]:
      Send passenger ID and flight reference data

2. [Bracelet Data Receiver] → [Server Sync Handler]:
      Forward validated bracelet data packet

3. [Server Sync Handler] → [Database]:
      Query passenger and flight record for verification

4. [Database] → [Server Sync Handler]:
      Return matching record and verification status

5. [Server Sync Handler] → [Database]:
      Update verification log and timestamp entry

6. [Server Sync Handler] → [Bracelet Acknowledgment Unit]:
      Send synchronization acknowledgment (ACK) message

7. [Bracelet Acknowledgment Unit] → [Passenger Bracelet]:
      Display sync success indicator (LED/alert)

---------------------------------------------------------------
End of Sequence

Summary (Scope-Focused):
The bracelet transmits data.
The receiver and server validate and store it.
The server confirms completion, and the bracelet shows success.

Activity Diagram — Bracelet Sync Operation
Start
  |
  v
[Bracelet captures passenger ID and flight reference]
  |
  v
[Bracelet stores temporary data in memory]
  |
  v
[Bracelet transmits data to Bracelet Data Receiver]
  |
  v
[Receiver validates data integrity]
  |----> [If invalid → Display error → End]
  |
  v
[Forward validated data to Server Sync Handler]
  |
  v
[Server decodes data payload]
  |
  v
[Server queries database for passenger and flight match]
  |
  v
[Database returns verification result]
  |
  v
[Server updates verification log and timestamp]
  |
  v
[Server sends acknowledgment (ACK) to bracelet]
  |
  v
[Bracelet receives ACK and displays sync success indicator]
  |
  v
End

🧩 Explanation (Aligned with Plan & Scope)
Start to Transmission:
The bracelet gathers essential identifiers (Passenger ID and Flight Ref) and prepares them for transmission.
Validation Phase:
The receiver checks whether the data is intact and valid before passing it forward.
Server Processing:
The Server Sync Handler interprets the data, checks it against the flight and passenger database, and logs the transaction for record-keeping.
Acknowledgment:
Once validated and stored, the server sends back an acknowledgment to confirm successful synchronization.
Completion:
The bracelet receives the ACK and confirms the success via a visual indicator (LED or display), ensuring the passenger or staff knows the process is complete.

Class Diagram — AirLink System
+------------------+
|   Passenger      |
+------------------+
| passenger_id     |
| name             |
| email            |
| contact_no       |
| nationality      |
+------------------+
| createBooking()  |
| viewFlightInfo() |
+------------------+

          1
          |
          | books
          |
          *
+------------------+
|   Booking        |
+------------------+
| booking_id       |
| passenger_id     |
| flight_id        |
| seat_no          |
| booking_status    |
+------------------+
| confirmBooking() |
| assignBracelet() |
+------------------+

          1
          |
          | assigned_to
          |
          1
+------------------+
|   Bracelet       |
+------------------+
| bracelet_id      |
| rfid_tag         |
| status           |
| battery_level    |
| last_sync_time   |
+------------------+
| syncData()       |
| showIndicator()  |
| deactivate()     |
+------------------+

          1
          |
          | linked_to
          |
          *
+------------------+
|   Flight         |
+------------------+
| flight_id        |
| flight_no        |
| destination      |
| departure_time   |
| gate_no          |
| status           |
+------------------+
| updateStatus()   |
| getFlightInfo()  |
+------------------+

          1
          |
          | handled_by
          |
          1
+------------------+
|   Server         |
+------------------+
| server_id        |
| location         |
| ip_address       |
| sync_status      |
+------------------+
| validateData()   |
| storeLog()       |
| sendAck()        |
+------------------+

          1
          |
          | logs
          |
          *
+------------------+
|   SyncLog        |
+------------------+
| log_id           |
| bracelet_id      |
| server_id        |
| timestamp        |
| sync_status      |
| remarks          |
+------------------+
| recordLog()      |
| getSyncHistory() |
+------------------+

📘 Explanation (Within Scope)
Passenger — creates a booking, holds personal details.
Booking — links a passenger and flight, and assigns a bracelet.
Bracelet — unique device ID; stores and syncs flight info for a passenger.
Flight — contains flight schedule and gate info, updated by the system.
Server — validates, stores, and acknowledges bracelet sync transactions.
SyncLog — keeps the record of all data syncs between bracelet and server for audit and analytics.

Database Schema Diagram — AirLink (MySQL)
TABLE: passengers
------------------------------------------------
passenger_id      INT AUTO_INCREMENT PRIMARY KEY
name               VARCHAR(100)
email              VARCHAR(100)
contact_no         VARCHAR(20)
nationality        VARCHAR(50)


TABLE: flights
------------------------------------------------
flight_id          INT AUTO_INCREMENT PRIMARY KEY
flight_no          VARCHAR(20)
destination        VARCHAR(100)
departure_time     DATETIME
gate_no            VARCHAR(10)
status             VARCHAR(20)       -- e.g., Scheduled, Boarding, Departed


TABLE: bookings
------------------------------------------------
booking_id         INT AUTO_INCREMENT PRIMARY KEY
passenger_id       INT NOT NULL
flight_id          INT NOT NULL
seat_no            VARCHAR(10)
booking_status     VARCHAR(20)       -- e.g., Confirmed, Pending, Cancelled
assigned_bracelet  VARCHAR(50)       -- bracelet_id reference
FOREIGN KEY (passenger_id) REFERENCES passengers(passenger_id)
FOREIGN KEY (flight_id) REFERENCES flights(flight_id)


TABLE: bracelets
------------------------------------------------
bracelet_id        VARCHAR(50) PRIMARY KEY
rfid_tag           VARCHAR(100) UNIQUE
status             VARCHAR(20)       -- Active, Inactive, Assigned
battery_level      INT               -- percentage
last_sync_time     DATETIME          -- last communication with server


TABLE: servers
------------------------------------------------
server_id          INT AUTO_INCREMENT PRIMARY KEY
location           VARCHAR(100)
ip_address         VARCHAR(50)
sync_status        VARCHAR(20)       -- Active, Offline, Maintenance


TABLE: sync_logs
------------------------------------------------
log_id             INT AUTO_INCREMENT PRIMARY KEY
bracelet_id        VARCHAR(50)
server_id          INT
timestamp          DATETIME
sync_status        VARCHAR(20)       -- Success, Failed
remarks            VARCHAR(255)
FOREIGN KEY (bracelet_id) REFERENCES bracelets(bracelet_id)
FOREIGN KEY (server_id) REFERENCES servers(server_id)

💡 Explanation (Focused on Plan & Scope)
passengers — holds traveler information linked to bookings.
flights — stores scheduled flight data and gate assignments.
bookings — connects passengers to flights and maps bracelet assignments.
bracelets — stores unique wearable IDs and real-time sync status.
servers — records each airport’s local or central AirLink server instance.
sync_logs — tracks all bracelet–server communication events for audit, analytics, and system reliability reporting.
All relationships match the plan:
Passenger → Booking → Flight
Booking → Bracelet
Bracelet → SyncLog → Server

Text-Based ERD — AirLink System
+------------------+        1 ────────< +------------------+
|   passengers     |-------------------|     bookings      |
+------------------+                   +------------------+
| passenger_id PK  |                   | booking_id PK     |
| name             |                   | passenger_id FK   |
| email            |                   | flight_id FK      |
| contact_no       |                   | seat_no           |
| nationality      |                   | booking_status    |
+------------------+                   | assigned_bracelet |
                                       +------------------+
                                                |
                                                | 1
                                                |
                                                v
                                       +------------------+
                                       |   bracelets      |
                                       +------------------+
                                       | bracelet_id PK   |
                                       | rfid_tag         |
                                       | status           |
                                       | battery_level    |
                                       | last_sync_time   |
                                       +------------------+
                                                |
                                                | 1 ────────< (records)
                                                v
                                       +------------------+
                                       |   sync_logs      |
                                       +------------------+
                                       | log_id PK        |
                                       | bracelet_id FK    |
                                       | server_id FK      |
                                       | timestamp         |
                                       | sync_status       |
                                       | remarks           |
                                       +------------------+
                                                ^
                                                | N
                                                |
                                                | 1
                                       +------------------+
                                       |   servers        |
                                       +------------------+
                                       | server_id PK     |
                                       | location         |
                                       | ip_address       |
                                       | sync_status      |
                                       +------------------+

(passenger) 1 ────────< (booking) >──────── 1 (flight)

🧭 Explanation (Strictly Scoped to Plan)
Passengers → Bookings (1:N)
One passenger can have multiple bookings.
Flights → Bookings (1:N)
A single flight can have many bookings.
Bookings → Bracelets (1:1)
Each booking is assigned exactly one bracelet during check-in.
Bracelets → Sync Logs (1:N)
One bracelet can generate multiple sync logs during its use.
Servers → Sync Logs (1:N)
One server can record multiple sync transactions from many bracelets.

✅ Summary of Core Relationships:
Passenger 1─< Booking >─1 Flight
Booking 1─1 Bracelet
Bracelet 1─< SyncLog >─1 Server

AirLink System — Data Dictionary

🧍‍♂️ Table: passengers
Field Name
Data Type
Description
passenger_id
INT (PK)
Unique identifier for each passenger.
name
VARCHAR(100)
Full name of the passenger.
email
VARCHAR(100)
Passenger’s email address for updates and notifications.
contact_no
VARCHAR(20)
Passenger’s contact number.
nationality
VARCHAR(50)
Passenger’s nationality or country of origin.


✈️ Table: flights
Field Name
Data Type
Description
flight_id
INT (PK)
Unique identifier for each flight.
flight_no
VARCHAR(20)
Flight number assigned by the airline.
destination
VARCHAR(100)
Destination airport or city name.
departure_time
DATETIME
Scheduled departure date and time.
gate_no
VARCHAR(10)
Boarding gate assigned for the flight.
status
VARCHAR(20)
Current flight status (Scheduled, Boarding, Departed).


🧾 Table: bookings
Field Name
Data Type
Description
booking_id
INT (PK)
Unique identifier for each booking record.
passenger_id
INT (FK)
References the passenger who made the booking.
flight_id
INT (FK)
References the flight booked by the passenger.
seat_no
VARCHAR(10)
Seat number assigned to the passenger.
booking_status
VARCHAR(20)
Current status of booking (Pending, Confirmed, Cancelled).
assigned_bracelet
VARCHAR(50)
ID of the bracelet linked to this booking.


⌚ Table: bracelets
Field Name
Data Type
Description
bracelet_id
VARCHAR(50) (PK)
Unique identifier of the bracelet unit.
rfid_tag
VARCHAR(100)
RFID or NFC tag value for contactless verification.
status
VARCHAR(20)
Bracelet’s operational state (Active, Inactive, Assigned).
battery_level
INT
Battery percentage level of the bracelet.
last_sync_time
DATETIME
Timestamp of the last data synchronization with server.


🖥️ Table: servers
Field Name
Data Type
Description
server_id
INT (PK)
Unique identifier for each server instance.
location
VARCHAR(100)
Airport or facility location of the server.
ip_address
VARCHAR(50)
Server’s local or WAN IP address.
sync_status
VARCHAR(20)
Indicates if the server is Active, Offline, or under Maintenance.


🔄 Table: sync_logs
Field Name
Data Type
Description
log_id
INT (PK)
Unique identifier for each synchronization record.
bracelet_id
VARCHAR(50) (FK)
References the bracelet involved in the sync.
server_id
INT (FK)
References the server that handled the sync process.
timestamp
DATETIME
Date and time when the synchronization occurred.
sync_status
VARCHAR(20)
Indicates success or failure of sync.
remarks
VARCHAR(255)
Optional comments or details on the sync process.


🔗 Relationships Summary
Relationship
Description
passengers → bookings
One passenger can have many bookings.
flights → bookings
One flight can be booked by multiple passengers.
bookings → bracelets
Each booking is assigned one bracelet.
bracelets → sync_logs
One bracelet can have multiple sync records.
servers → sync_logs
Each server can process multiple bracelet sync logs.



PROCESS SPECIFICATION (P-SPEC) — AirLink System

Process 1: Passenger Flight Booking
Process ID: P1
Description:
Handles the creation and validation of passenger flight bookings and stores the record in the AirLink database.
Input:
Passenger details (Name, Email, Contact No., Nationality)
Flight details (Flight No., Destination, Departure Time, Seat No.)
Output:
Booking record stored under status Pending Bracelet Assignment
Source: Passenger / Airline Website / Ticketing Agent
Destination: bookings table
Data Store Accessed: passengers, flights, bookings
Processing Steps:
Receive booking request.
Validate flight and seat availability.
Insert passenger record if new.
Create booking entry with default status Pending Bracelet Assignment.

Process 2: Bracelet Assignment (Check-In)
Process ID: P2
Description:
Links an available AirLink Bracelet to a passenger’s confirmed booking record.
Input:
Passenger booking reference or name
Bracelet ID (RFID/Wi-Fi tag)
Output:
Bracelet data mapped to booking
Bracelet activated with flight information
Source: Check-In Staff / Self-Service Kiosk
Destination: bracelets and bookings tables
Data Store Accessed: bookings, bracelets
Processing Steps:
Retrieve booking by passenger name or booking reference.
Validate bracelet availability (status = Inactive).
Update booking record with assigned_bracelet.
Set bracelet status to Active and store passenger flight details.

Process 3: Boarding Verification
Process ID: P3
Description:
Validates passenger identity and boarding authorization via bracelet scan.
Input:
Bracelet RFID tag or ID
Scanner event from boarding gate
Output:
Boarding verification result (Approved / Denied)
Visual or haptic alert on bracelet
Source: Boarding Staff / Security Gate Scanner
Destination: sync_logs, bookings, bracelets
Data Store Accessed: bookings, bracelets
Processing Steps:
Scan bracelet RFID/NFC tag.
Match against booking record in local AirLink server.
If verified → log status “Cleared for Boarding”, trigger green LED/vibration.
If not verified → log “Denied”, trigger red LED or alert tone.
Store verification time in sync logs.

Process 4: Server-Side Data Handling & Sync
Process ID: P4
Description:
Handles synchronization of bracelet data and boarding records between Local AirLink Server and Central Airline Server.
Input:
Bracelet activity logs
Local database updates
Output:
Updated records in central server
Sync status confirmation
Source: Local AirLink Server
Destination: Central Airline Server
Data Store Accessed: sync_logs, servers
Processing Steps:
Collect unsynchronized bracelet and booking logs.
Compare timestamps with central records.
Transmit new or updated entries.
Update sync_status to Success or Failed.
Record sync event in sync_logs table.

Process 5: Bracelet Deactivation / Collection
Process ID: P5
Description:
Deactivates the bracelet after the passenger boards and prepares it for reuse.
Input:
Boarding confirmation signal
Bracelet ID
Output:
Bracelet set to Inactive
Booking marked as Boarded
Source: Flight Crew / Boarding Staff
Destination: bracelets, bookings
Data Store Accessed: bookings, bracelets
Processing Steps:
Identify boarded passenger bracelet.
Mark booking record as Boarded.
Set bracelet status to Inactive.
Archive logs for analytics and audit.

Process 6: Reporting and Analytics (System Logs)
Process ID: P6
Description:
Generates summary reports for management and performance monitoring.
Input:
Sync logs
Booking and boarding records
Output:
Boarding rate report
Bracelet usage summary
Server performance status
Source: AirLink Admin Console
Destination: Administrator / Airport Authority
Data Store Accessed: bookings, bracelets, sync_logs, servers
Processing Steps:
Query all recent logs and booking data.
Calculate metrics (e.g., total boarded, sync success rate).
Generate summarized report in dashboard format.
Export or sync report to central database if required.

✅ Summary (Strictly Within Scope)
All six processes align directly with your AirLink flow:
P1–P2: Booking & Bracelet Assignment
P3: Boarding Verification
P4: Server Sync
P5: Bracelet Deactivation
P6: Reporting

System Interface Design — AirLink (Scope-only)

1) Passenger Booking Portal (External / Integrated)
Purpose: receive booking details (source: airline/ticketing system).
Primary user: Passenger (via airline website) — AirLink receives booking data from airline systems, not direct manual passenger entry in AirLink.
Visible components (Airline UI — what AirLink expects):
Booking form fields (on Airline site): full_name, email, contact_no, nationality, flight_no, departure_time, seat_no
Confirmation page with booking reference (PNR)
Key user actions:
Passenger completes booking on airline site → airline system sends booking payload to AirLink.
Validations / Error states:
Airline must validate seat availability before sending to AirLink.
If AirLink receives malformed booking payload → respond 400 Bad Request and log.
Backend integration (AirLink-facing):
API Endpoint (receive booking): POST /api/v1/bookings/import
Payload: { passenger: {name,email,contact_no,nationality}, flight_no, departure_time, seat_no, booking_ref }
On success: create passengers (if new) and bookings record with booking_status = 'Pending Bracelet Assignment' → respond 201 Created with booking_id.
Data Stores: passengers, flights (lookup), bookings (insert).

2) Check-In Staff Console (Desktop / Counter UI)
Purpose: retrieve booking, assign bracelet, activate bracelet for passenger (Process P2).
Primary user: Check-in Staff.
Screen layout (compact text wireframe):
Header: Flight selector (flight_no dropdown / search)
Left pane: Search Booking
Search input: booking_ref or passenger_name
Button: Search
Center pane: Booking Details (read-only until assign)
Fields shown: passenger_name, contact_no, flight_no, departure_time, seat_no, booking_status
Right pane: Bracelet Assignment
Field: Scan Bracelet RFID (input populated by scanner)
Display: bracelet_id, battery_level, status (Inactive/Active)
Buttons: Assign Bracelet, Cancel
Footer: Notifications / Action result
Key user actions:
Search booking → system displays booking record.
Scan/enter Bracelet RFID → system fetches bracelet record.
Click Assign Bracelet:
System maps assigned_bracelet in bookings
Updates bracelets.status = 'Active' and last_sync_time on success
Optionally pushes flight info to bracelet (sync action)
Validations / Error states:
If booking not found → show "Booking not found".
If bracelet status ≠ Inactive → show "Bracelet not available" and block assignment.
If booking already has an assigned bracelet → show confirmation and option to reassign (but out of scope if you want strict one-to-one; default: block unless override with reason).
Network / DB errors → display "Try again; error saved in logs."
Backend interactions:
Search booking: GET /api/v1/bookings?ref={booking_ref} → reads bookings + passengers + flights.
Get bracelet: GET /api/v1/bracelets/{rfid_tag} → reads bracelets.
Assign bracelet: POST /api/v1/bookings/{booking_id}/assign-bracelet
Payload: { bracelet_id }
Actions on server: update bookings.assigned_bracelet, update bracelets.status = 'Active', write entry to sync_logs if push attempted.
Respond: 200 OK + assignment result.
Data stores: bookings, bracelets, optional sync_logs.

3) Self-Service Kiosk UI (Simplified Check-in)
Purpose: allow passenger self check-in and bracelet pick-up (if you deploy kiosks).
Primary user: Passenger (assisted kiosk).
Visible components:
Input: Booking Reference or Scan QR (from booking confirmation)
Display booking details and Assign Bracelet button (for kiosk admin)
Scan Bracelet field (RFID/NFC reader input)
Confirmation screen: "Bracelet Assigned — Please wear."
Actions & validations:
Same flow as Check-In Staff Console but simplified UI.
Validations: booking ownership (match with passenger name/email) before assignment.
Backend:
Calls same endpoints as Check-in Staff Console: GET /bookings, POST /bookings/{id}/assign-bracelet.

4) Boarding Gate Interface (Gate Scanner Screen)
Purpose: verify bracelet at gate, show immediate result to staff (Process P3).
Primary user: Security / Boarding Staff.
Screen layout:
Top: Current Flight (flight_no, gate_no, departure_time)
Center: Live Scan Area
Field: RFID/NFC input (auto-capture)
Display: passenger_name, seat_no, booking_status
Result Indicator: GREEN: Cleared / RED: Denied
Bottom: Action Buttons
Override (for manual staff check - logs action)
Collect Bracelet (mark inactive)
Side: Recent scan logs (last 10 entries)
User actions:
Staff scans bracelet → UI shows instant verification result.
If Cleared → system updates booking to Boarded and logs event.
If Denied → staff can Override after manual check (override flow writes remarks in sync_logs).
Validations / error states:
If no matching booking for bracelet → show Denied with reason No matching booking.
If flight mismatch (bracelet assigned to different flight/time) → show Denied: Wrong Flight.
If DB unreachable → show Cannot verify; check network and queue local log for sync.
Backend interactions:
Verify scan: POST /api/v1/verification
Payload: { bracelet_id, gate_no, scanner_timestamp }
Server actions: lookup bookings by assigned_bracelet → verify flight_no and departure_time → update booking booking_status = 'Boarded' if valid → insert sync_logs record → respond { result: "Cleared" | "Denied", reason }.
Collect bracelet (deactivate): POST /api/v1/bracelets/{bracelet_id}/deactivate → sets bracelets.status = 'Inactive'.
Data stores: bookings, sync_logs, bracelets.

5) Admin Dashboard (Airport/System Administrator)
Purpose: monitor system health, view logs, run reports (P6).
Primary user: System Administrator / Airport Authority.
Main tabs (text-based, minimal & focused):
Dashboard Overview: real-time counts: active bracelets, flights boarding now, pending syncs.
Bracelet Management: list / search bracelets, view status, battery, last_sync_time, deactivate/reactivate.
Bookings Monitor: search bookings, view assigned bracelets and statuses.
Sync Logs: list of recent sync_logs (filter by status Success/Failed).
System Sync Status: view servers table and sync_status per server.
Key actions:
Filter and search records.
Force re-sync (select logs or records → POST /api/v1/sync/force).
Export a report (CSV of selected records) → uses same data stores.
Validations / error states:
Strict role-based access — only admins can run forced syncs or export logs.
If forced sync fails → record failure in sync_logs.
Backend endpoints:
GET /api/v1/admin/overview → aggregate reads from bookings, bracelets, sync_logs.
GET /api/v1/sync_logs?filter=failed → read sync_logs.
POST /api/v1/sync/force → attempt immediate sync for a local server or dataset → creates a server_sync event.
Data stores: bookings, bracelets, sync_logs, servers.

6) Common UI / UX & Accessibility Notes (Scope-limited)
All screens must show clear, immediate feedback for scan/assign actions (Green/Red + short text).
Keep confirmation dialogs for destructive actions (deactivate bracelet, override boarding).
Minimal confirmation steps for staff to keep gates moving.
Accessibility: haptic/vibration and LED indicators are part of bracelet feedback for passengers (matches plan).
Offline behavior: gate UI must locally queue verification attempts if DB/Network unavailable and mark them Pending in sync_logs. (This is within scope—server sync handles deferred uploads.)

7) Security & Data Flow Mapping (Interface-focused, in-scope)
All API calls must be authenticated (API key / staff token) — interface enforces login for staff/admin.
Sensitive actions (assign/reassign, deactivate, force-sync) require admin/staff role check.
Data written by interfaces map directly to these tables:
Assign → bookings.assigned_bracelet, bracelets.status
Scan verify → sync_logs (and bookings.booking_status if cleared)
Deactivate → bracelets.status = 'Inactive'
Admin sync → servers, sync_logs

8) Minimal Error Responses (standardized for UI)
200 OK — success (with JSON { success: true, data: ... })
201 Created — resource created
400 Bad Request — malformed payload (display: "Invalid data")
404 Not Found — booking/bracelet not found
409 Conflict — bracelet already assigned (display actionable message)
500 Server Error — show "System error; log created"

Final note (keeps scope):
All screens and endpoints described map directly to the processes and DB schema we agreed on: booking import (P1), bracelet assignment (P2), boarding verification (P3), server sync (P4), deactivation (P5), and reporting (P6). No payment, marketing, biometric, or extra features were added.

AirLink API Reference (JSON Samples)
All endpoints use JSON and require authentication headers (Authorization: Bearer {token}) for staff/admin interfaces.
Version: v1
Base URL (local deployment example): https://airlink.local/api/v1

1️⃣ POST /bookings/import
Purpose: Receive flight booking details from airline systems (Passenger Flight Booking process)
📨 Request
{
  "passenger": {
    "name": "Romar Tabaosares",
    "email": "romar@example.com",
    "contact_no": "+639123456789",
    "nationality": "PH"
  },
  "flight_no": "PR124",
  "departure_time": "2025-12-15T09:30:00",
  "seat_no": "12A",
  "booking_ref": "ABC123"
}
📬 Response
{
  "success": true,
  "message": "Booking successfully imported.",
  "data": {
    "booking_id": 1045,
    "booking_status": "Pending Bracelet Assignment"
  }
}

2️⃣ GET /bookings?ref={booking_ref}
Purpose: Retrieve passenger booking record for verification or bracelet assignment.
📬 Response
{
  "success": true,
  "data": {
    "booking_id": 1045,
    "booking_ref": "ABC123",
    "flight_no": "PR124",
    "seat_no": "12A",
    "departure_time": "2025-12-15T09:30:00",
    "booking_status": "Pending Bracelet Assignment",
    "passenger": {
      "name": "Romar Tabaosares",
      "contact_no": "+639123456789"
    }
  }
}

3️⃣ GET /bracelets/{rfid_tag}
Purpose: Retrieve bracelet info before assignment.
📬 Response
{
  "success": true,
  "data": {
    "bracelet_id": 57,
    "rfid_tag": "RFID-AIR-0021",
    "status": "Inactive",
    "battery_level": "87%",
    "last_sync_time": "2025-11-03T16:00:00"
  }
}

4️⃣ POST /bookings/{booking_id}/assign-bracelet
Purpose: Assign bracelet to passenger at check-in counter or kiosk.
📨 Request
{
  "bracelet_id": 57
}
📬 Response
{
  "success": true,
  "message": "Bracelet assigned successfully.",
  "data": {
    "booking_id": 1045,
    "bracelet_id": 57,
    "bracelet_status": "Active",
    "flight_no": "PR124",
    "departure_time": "2025-12-15T09:30:00"
  }
}
System Action:
bookings.assigned_bracelet = 57
bracelets.status = 'Active'
Push booking data to bracelet for sync
Insert record into sync_logs with status='Pending'

5️⃣ POST /verification
Purpose: Verify passenger bracelet at boarding gate.
📨 Request
{
  "bracelet_id": 57,
  "gate_no": "G05",
  "scanner_timestamp": "2025-12-15T09:00:10"
}
📬 Response (Success)
{
  "result": "Cleared",
  "message": "Passenger verified for boarding.",
  "data": {
    "booking_id": 1045,
    "passenger_name": "Romar Tabaosares",
    "seat_no": "12A",
    "flight_no": "PR124"
  }
}
📬 Response (Failure)
{
  "result": "Denied",
  "reason": "Wrong flight or booking not found.",
  "bracelet_id": 57
}
System Action:
If cleared → update bookings.booking_status = 'Boarded'
Insert log in sync_logs with event_type='Boarding Verification'

6️⃣ POST /bracelets/{bracelet_id}/deactivate
Purpose: Mark bracelet as inactive after boarding.
📨 Request
{
  "reason": "Collected after boarding"
}
📬 Response
{
  "success": true,
  "message": "Bracelet deactivated and archived.",
  "data": {
    "bracelet_id": 57,
    "status": "Inactive",
    "last_sync_time": "2025-12-15T09:15:00"
  }
}
System Action:
bracelets.status = 'Inactive' → bookings.assigned_bracelet = NULL (optional archival)

7️⃣ GET /admin/overview
Purpose: View summarized system status.
📬 Response
{
  "data": {
    "active_bracelets": 180,
    "pending_syncs": 3,
    "flights_boarding_now": 2,
    "total_bookings_today": 245
  }
}

8️⃣ GET /sync_logs?filter=failed
Purpose: Show recent failed sync attempts (for admins).
📬 Response
{
  "data": [
    {
      "sync_id": 212,
      "event_type": "Boarding Verification",
      "status": "Failed",
      "timestamp": "2025-12-15T09:20:11",
      "error_message": "No internet connection."
    }
  ]
}

9️⃣ POST /sync/force
Purpose: Manually trigger data synchronization (admin only).
📨 Request
{
  "server_id": 3,
  "sync_type": "pending_logs"
}
📬 Response
{
  "success": true,
  "message": "Sync initiated successfully.",
  "details": {
    "server_id": 3,
    "records_synced": 45,
    "status": "In Progress"
  }
}
System Action:
Pull all pending logs from sync_logs and push to the Central Airline Server.
Update servers.last_sync_time and sync_logs.status.

🔐 Standard Error Responses
HTTP Code
Meaning
Example
400
Bad Request
{"success": false, "message": "Invalid data format."}
401
Unauthorized
{"success": false, "message": "Invalid or expired token."}
404
Not Found
{"success": false, "message": "Booking not found."}
409
Conflict
{"success": false, "message": "Bracelet already assigned."}
500
Server Error
{"success": false, "message": "Internal server error."}


Would you like me to make a REST API endpoint summary table next (with methods, URIs, and linked processes like P1–P6)? It would serve as your developer cheat sheet.

AirLink API Reference (JSON Samples)
All endpoints use JSON and require authentication headers (Authorization: Bearer {token}) for staff/admin interfaces.
Version: v1
Base URL (local deployment example): https://airlink.local/api/v1

1️⃣ POST /bookings/import
Purpose: Receive flight booking details from airline systems (Passenger Flight Booking process)
📨 Request
{
  "passenger": {
    "name": "Romar Tabaosares",
    "email": "romar@example.com",
    "contact_no": "+639123456789",
    "nationality": "PH"
  },
  "flight_no": "PR124",
  "departure_time": "2025-12-15T09:30:00",
  "seat_no": "12A",
  "booking_ref": "ABC123"
}
📬 Response
{
  "success": true,
  "message": "Booking successfully imported.",
  "data": {
    "booking_id": 1045,
    "booking_status": "Pending Bracelet Assignment"
  }
}

2️⃣ GET /bookings?ref={booking_ref}
Purpose: Retrieve passenger booking record for verification or bracelet assignment.
📬 Response
{
  "success": true,
  "data": {
    "booking_id": 1045,
    "booking_ref": "ABC123",
    "flight_no": "PR124",
    "seat_no": "12A",
    "departure_time": "2025-12-15T09:30:00",
    "booking_status": "Pending Bracelet Assignment",
    "passenger": {
      "name": "Romar Tabaosares",
      "contact_no": "+639123456789"
    }
  }
}

3️⃣ GET /bracelets/{rfid_tag}
Purpose: Retrieve bracelet info before assignment.
📬 Response
{
  "success": true,
  "data": {
    "bracelet_id": 57,
    "rfid_tag": "RFID-AIR-0021",
    "status": "Inactive",
    "battery_level": "87%",
    "last_sync_time": "2025-11-03T16:00:00"
  }
}

4️⃣ POST /bookings/{booking_id}/assign-bracelet
Purpose: Assign bracelet to passenger at check-in counter or kiosk.
📨 Request
{
  "bracelet_id": 57
}
📬 Response
{
  "success": true,
  "message": "Bracelet assigned successfully.",
  "data": {
    "booking_id": 1045,
    "bracelet_id": 57,
    "bracelet_status": "Active",
    "flight_no": "PR124",
    "departure_time": "2025-12-15T09:30:00"
  }
}
System Action:
bookings.assigned_bracelet = 57
bracelets.status = 'Active'
Push booking data to bracelet for sync
Insert record into sync_logs with status='Pending'

5️⃣ POST /verification
Purpose: Verify passenger bracelet at boarding gate.
📨 Request
{
  "bracelet_id": 57,
  "gate_no": "G05",
  "scanner_timestamp": "2025-12-15T09:00:10"
}
📬 Response (Success)
{
  "result": "Cleared",
  "message": "Passenger verified for boarding.",
  "data": {
    "booking_id": 1045,
    "passenger_name": "Romar Tabaosares",
    "seat_no": "12A",
    "flight_no": "PR124"
  }
}
📬 Response (Failure)
{
  "result": "Denied",
  "reason": "Wrong flight or booking not found.",
  "bracelet_id": 57
}
System Action:
If cleared → update bookings.booking_status = 'Boarded'
Insert log in sync_logs with event_type='Boarding Verification'

6️⃣ POST /bracelets/{bracelet_id}/deactivate
Purpose: Mark bracelet as inactive after boarding.
📨 Request
{
  "reason": "Collected after boarding"
}
📬 Response
{
  "success": true,
  "message": "Bracelet deactivated and archived.",
  "data": {
    "bracelet_id": 57,
    "status": "Inactive",
    "last_sync_time": "2025-12-15T09:15:00"
  }
}
System Action:
bracelets.status = 'Inactive' → bookings.assigned_bracelet = NULL (optional archival)

7️⃣ GET /admin/overview
Purpose: View summarized system status.
📬 Response
{
  "data": {
    "active_bracelets": 180,
    "pending_syncs": 3,
    "flights_boarding_now": 2,
    "total_bookings_today": 245
  }
}

8️⃣ GET /sync_logs?filter=failed
Purpose: Show recent failed sync attempts (for admins).
📬 Response
{
  "data": [
    {
      "sync_id": 212,
      "event_type": "Boarding Verification",
      "status": "Failed",
      "timestamp": "2025-12-15T09:20:11",
      "error_message": "No internet connection."
    }
  ]
}

9️⃣ POST /sync/force
Purpose: Manually trigger data synchronization (admin only).
📨 Request
{
  "server_id": 3,
  "sync_type": "pending_logs"
}
📬 Response
{
  "success": true,
  "message": "Sync initiated successfully.",
  "details": {
    "server_id": 3,
    "records_synced": 45,
    "status": "In Progress"
  }
}
System Action:
Pull all pending logs from sync_logs and push to the Central Airline Server.
Update servers.last_sync_time and sync_logs.status.

🔐 Standard Error Responses
HTTP Code
Meaning
Example
400
Bad Request
{"success": false, "message": "Invalid data format."}
401
Unauthorized
{"success": false, "message": "Invalid or expired token."}
404
Not Found
{"success": false, "message": "Booking not found."}
409
Conflict
{"success": false, "message": "Bracelet already assigned."}
500
Server Error
{"success": false, "message": "Internal server error."}


Would you like me to make a REST API endpoint summary table next (with methods, URIs, and linked processes like P1–P6)? It would serve as your developer cheat sheet.
You said:
REST API endpoint summary table next, make sure to focus on the plan and architecture, no misdirection, avoid extra'
ChatGPT said:
Perfect, Mar — here’s the REST API Endpoint Summary Table for your AirLink System, strictly aligned with the plan, architecture, and flow we’ve built (no extras, no misdirection).
Each endpoint connects directly to your processes (P1–P6) and MySQL schema.

🧩 AirLink REST API Endpoint Summary Table
Process ID
Process Name
HTTP Method
Endpoint URI
Main Actors
Purpose / Function
Related Tables
P1
Passenger Flight Booking
POST
/bookings/import
Airline System / Passenger
Imports flight booking data (name, flight no., seat, date/time) from airline or portal.
bookings, passengers
P2
Retrieve Booking Info
GET
/bookings?ref={booking_ref}
Check-in Staff / System
Fetches booking details to verify before bracelet assignment.
bookings, passengers
P3
Bracelet Retrieval
GET
/bracelets/{rfid_tag}
Check-in Staff
Retrieves bracelet information and current status before linking.
bracelets
P4
Bracelet Assignment
POST
/bookings/{booking_id}/assign-bracelet
Check-in Staff / Kiosk
Links bracelet ID to passenger booking record; activates bracelet for sync.
bookings, bracelets, sync_logs
P5
Boarding Verification
POST
/verification
Boarding Security / Bracelet Scanner
Confirms bracelet identity and boarding authorization at the gate.
bookings, bracelets, sync_logs
P6
Bracelet Deactivation
POST
/bracelets/{bracelet_id}/deactivate
Boarding Staff / Flight Crew
Marks bracelet inactive after boarding and archives its data.
bracelets, sync_logs
P7
System Overview
GET
/admin/overview
Admin
Displays active bracelets, flights, and booking summary dashboard.
bookings, bracelets, sync_logs, servers
P8
Sync Logs Retrieval
GET
/sync_logs?filter=failed
Admin
Lists recent failed or pending synchronization attempts.
sync_logs
P9
Manual Server Sync
POST
/sync/force
Admin
Forces synchronization between Local and Central Servers.
servers, sync_logs


🗂️ Explanation (Aligned with Architecture)
Frontend: Booking portals, check-in kiosks, and admin dashboards call these endpoints.
Backend: Local AirLink Server (MySQL) processes requests, applies validation, and logs transactions.
Bracelet Layer: Communicates through internal sync (RFID/Wi-Fi) with the /verification and /assign-bracelet endpoints.
Central Server: Syncs booking, flight, and passenger updates through /sync/force.

System Flowchart (Text-Based – AirLink System)
[Start]
   │
   ▼
┌────────────────────────────┐
│ User Books Flight          │
│ (Flight Booking System)    │
└────────────────────────────┘
   │
   ▼
┌────────────────────────────┐
│ Airport Database Stores    │
│ Flight & Passenger Details │
└────────────────────────────┘
   │
   ▼
┌────────────────────────────┐
│ Bracelet Receives Assigned │
│ Passenger & Flight Data    │
│ (via Server Sync)          │
└────────────────────────────┘
   │
   ▼
┌────────────────────────────┐
│ Bracelet Stores Data Locally│
│ (Flight_ID, Passenger_ID,   │
│  Boarding_Status)           │
└────────────────────────────┘
   │
   ▼
┌────────────────────────────┐
│ Passenger Arrives at Gate  │
│ (Bracelet Detected by RFID │
│  / BLE Scanner)             │
└────────────────────────────┘
   │
   ▼
┌────────────────────────────┐
│ Boarding Verification      │
│  - System matches bracelet │
│    data with server record │
│  - If match: Boarding OK   │
│  - If mismatch: Flag Error │
└────────────────────────────┘
   │
   ▼
┌────────────────────────────┐
│ Server Updates Boarding    │
│ Status in Database         │
│ (Syncs Bracelet & Record)  │
└────────────────────────────┘
   │
   ▼



┌────────────────────────────┐
│ Web Dashboard Fetches Data │
│  - Displays Flight Status  │
│  - Shows Boarding Reports  │
└────────────────────────────┘
   │
   ▼
┌────────────────────────────┐
│ Admin Monitors Dashboard   │
│ (Can view logs or alerts)  │
└────────────────────────────┘
   │
   ▼
[End]

⚙️ Flow Summary
Data Entry Point: Flight & passenger info comes from the airport database.
Data Movement: Server pushes data to the bracelet; bracelet syncs with the server.
Processing: Boarding verification checks validity between bracelet and server data.
Output: Dashboard reflects real-time boarding and sync updates.

System Deployment Diagram (Text-Based – AirLink)
──────────────────────────────────────────────────────────────
                AIRLINK SYSTEM DEPLOYMENT DIAGRAM
──────────────────────────────────────────────────────────────

[Layer 1: Physical Devices / Nodes]

┌─────────────────────────────┐
│  Bracelet Device (Edge Node)│
│  -------------------------- │
│  • Stores passenger & flight│
│    data (temporary memory)  │
│  • Handles local verification│
│  • Communicates via BLE/Wi-Fi│
│                             │
│  Components:                │
│   - Embedded microcontroller│
│   - Local storage (EEPROM)  │
│   - Communication module    │
└─────────────────────────────┘
             │
             │  (Data Sync via BLE/Wi-Fi)
             ▼
┌─────────────────────────────┐
│  AirLink Server (Central Node)│
│  -----------------------------│
│  • Runs main application logic│
│  • Manages MySQL database     │
│  • Handles REST API requests  │
│  • Synchronizes with bracelet │
│  • Interfaces with dashboard  │
│                              │
│  Components:                 │
│   - Web Server (Tomcat/Nginx)│
│   - MySQL Database           │
│   - REST API service         │
└─────────────────────────────┘
             │
             │  (HTTPS / REST API)
             ▼
┌─────────────────────────────┐
│  Web Dashboard (Client Node)│
│  ---------------------------│
│  • Accessed by airport admin│
│  • Displays flight & boarding│
│    status, sync logs         │
│  • Uses data from server API │
│                              │
│  Components:                 │
│   - Web browser interface    │
│   - Admin authentication     │
└─────────────────────────────┘


──────────────────────────────────────────────────────────────
                DATA FLOW SUMMARY
──────────────────────────────────────────────────────────────
1. Airport database → Server → Bracelet  (Flight/Passenger Data)
2. Bracelet → Server  (Boarding verification + sync)
3. Server → Web Dashboard  (Status & reports)
──────────────────────────────────────────────────────────────

⚙️ Explanation
Bracelet Device – Edge component storing temporary passenger and flight info.
AirLink Server – Core processing and data management layer that syncs bracelet data and serves APIs.
Web Dashboard – Front-end interface for administrators to monitor flight and boarding status.
All communication follows a secure REST-based structure, ensuring real-time synchronization between devices and the server.

System Security Design (Text-Based – AirLink)
──────────────────────────────────────────────────────────────
                 AIRLINK SYSTEM SECURITY DESIGN
──────────────────────────────────────────────────────────────

[1] Authentication & Access Control
-----------------------------------
• Web Dashboard:
   - Admin login required before access.
   - Role-based access (Admin / Operator).
   - Passwords hashed using SHA-256 before storage.
   - Session timeout after inactivity.

• Bracelet Device:
   - Each bracelet has a unique Device_ID and Token.
   - Token validated by server during sync.

• Server API:
   - Requires valid API key or token for all requests.
   - Rejects unauthorized or expired sessions.

-----------------------------------
[2] Data Transmission Security
-----------------------------------
• Communication Channels:
   - HTTPS for dashboard ↔ server (REST API).
   - Encrypted BLE/Wi-Fi channel for bracelet ↔ server sync.

• Data Encryption:
   - All transmitted data encrypted using AES-128 standard.
   - Sensitive identifiers (Passenger_ID, Flight_ID) encoded.

-----------------------------------
[3] Database Security
-----------------------------------
• MySQL Security:
   - Only the AirLink Server has DB access credentials.
   - Uses restricted user accounts with least privilege.
   - Daily backup stored on secure storage.
   - No direct bracelet or dashboard access to database.

• Data Protection:
   - Passenger data stored in normalized tables.
   - Flight and sync logs protected by access permission.

-----------------------------------
[4] Application Security
-----------------------------------
• Input Validation:
   - All form inputs sanitized to prevent SQL injection or XSS.
   - Bracelet data validated before database write.

• Logging & Monitoring:
   - All access logs timestamped (user_id, activity, IP).
   - Invalid access attempts flagged for admin review.

• Error Handling:
   - Minimal error exposure (no system info shown in user errors).
   - Internal errors logged securely on server.

-----------------------------------
[5] Sync Integrity & Verification
-----------------------------------
• Data Consistency Check:
   - Every sync verifies Flight_ID + Passenger_ID match.
   - Bracelet and server timestamps compared to detect tampering.

• Redundancy:
   - Sync data queued if offline, transmitted upon reconnection.
   - Each record tagged with Sync_ID for traceability.

-----------------------------------
[6] Physical & Operational Security
-----------------------------------
• Bracelet:
   - Firmware locked (no external write access).
   - Reset only by authorized personnel.

• Server:
   - Hosted in secured environment with firewall and access control.
   - Regular patching and update policy applied.

• Admin Access:
   - Limited to authorized IT personnel only.
   - Multi-factor authentication (MFA) recommended.

──────────────────────────────────────────────────────────────

⚙️ Summary
The AirLink security structure protects:
Data in motion → via encryption (HTTPS, AES)
Data at rest → via access control and database isolation
Access and actions → via authentication, validation, and monitoring
All layers reinforce the core system goal: reliable, secure synchronization between bracelet devices, server, and dashboard.





