# Flight Status Management System

## Overview
The AirLink system now includes comprehensive flight status management that automatically updates passenger statuses and sends real-time notifications to bracelets based on flight events.

## Flight Statuses
- **Scheduled** - Flight is on time
- **Boarding** - Gate is open, passengers can board
- **Departed** - Flight has left
- **Delayed** - Flight is delayed
- **Cancelled** - Flight is cancelled

## Passenger Booking Statuses
- **Pending** - Booking created, not confirmed
- **Confirmed** - Booking confirmed, waiting to board
- **Boarded** - Passenger successfully boarded
- **Missed** - Passenger missed the flight (flight departed without boarding)
- **Cancelled** - Booking cancelled due to flight cancellation

## Automatic Status Updates

### When Flight Status Changes to "Departed"
1. System checks all passengers with status "Confirmed"
2. Automatically marks them as "Missed"
3. Sends notification: "Flight XXX has departed. You missed your flight."
4. Bracelet displays missed flight alert

### When Flight Status Changes to "Delayed"
1. Sends notification to ALL passengers on the flight
2. Message includes: delay duration and new departure time
3. Bracelet displays delay information

### When Flight Status Changes to "Cancelled"
1. Marks ALL passenger bookings as "Cancelled"
2. Sends notification with cancellation reason
3. Bracelet displays cancellation alert

### When Flight Status Changes to "Boarding"
1. Sends boarding call to all "Confirmed" passengers
2. Message includes: flight number and gate number
3. Bracelet displays boarding alert with LED pulse

## API Endpoints

### Update Flight Status
```
PUT /api/flights/:id/status
Body: {
  "status": "Departed|Boarding|Delayed|Cancelled|Scheduled",
  "delay_minutes": 30,  // Optional, for Delayed status
  "new_departure_time": "2024-12-20 10:30:00",  // Optional
  "cancellation_reason": "Weather conditions"  // Optional, for Cancelled
}
```

### Check Missed Flights (Batch)
```
POST /api/flights/check-missed
```
Scans all departed flights and marks non-boarded passengers as missed.

## Notification Types
- **MISSED_FLIGHT** - High priority, sent when passenger misses flight
- **FLIGHT_DELAYED** - High priority, sent when flight is delayed
- **FLIGHT_CANCELLED** - High priority, sent when flight is cancelled
- **BOARDING_CALL** - High priority, sent when boarding starts
- **BOARDING_REMINDER** - Sent 30 min before departure
- **BOARDING_SOON** - Sent 45 min before departure

## How It Works

### Real-Time Flow
```
Admin updates flight status
    ↓
Backend processes status change
    ↓
Passenger statuses automatically updated
    ↓
Notifications created in database
    ↓
Bracelet heartbeat sync (every 10 seconds)
    ↓
Bracelet receives notifications
    ↓
Bracelet displays alert with LED + vibration
    ↓
Passenger sees notification
```

### Missed Flight Detection
```
Flight status changed to "Departed"
    ↓
System queries all passengers with booking_status = "Confirmed"
    ↓
For each passenger:
  - Update booking_status to "Missed"
  - Create notification
  - Log event
    ↓
Next bracelet sync delivers notification
```

## Testing

### Setup
1. Apply database patches:
   ```bash
   mysql -u root < database/patch-0013-notifications.sql
   mysql -u root < database/patch-0014-flight-status-management.sql
   ```

2. Restart backend server:
   ```bash
   cd backend
   node server.js
   ```

3. Open bracelet simulator:
   ```
   bracelet/simulator/live/bracelet-simulator-ges001-live-v2.html
   ```

4. Assign bracelet to a passenger (use dashboard)

5. Open test page:
   ```
   test-flight-status.html
   ```

### Test Scenarios

#### Test 1: Missed Flight
1. Assign GES001 to a passenger on Flight 1
2. In test page, set Flight ID = 1, Status = "Departed"
3. Click "Update Flight Status"
4. Watch bracelet simulator - should show "You missed your flight"

#### Test 2: Flight Delay
1. Assign GES002 to a passenger on Flight 2
2. Set Flight ID = 2, Status = "Delayed", Delay = 30 minutes
3. Click "Update Flight Status"
4. Bracelet shows delay notification

#### Test 3: Flight Cancellation
1. Assign GES003 to a passenger on Flight 3
2. Set Flight ID = 3, Status = "Cancelled", Reason = "Weather"
3. Click "Update Flight Status"
4. Bracelet shows cancellation alert

#### Test 4: Boarding Call
1. Assign GES004 to a passenger on Flight 4
2. Set Flight ID = 4, Status = "Boarding"
3. Click "Update Flight Status"
4. Bracelet shows "Boarding Now!" alert

## Database Schema

### notifications table
```sql
notification_id INT PRIMARY KEY
bracelet_id VARCHAR(50)
notification_type VARCHAR(50)
message VARCHAR(255)
priority VARCHAR(20)  -- Normal, High
is_read BOOLEAN
created_at TIMESTAMP
delivered_at TIMESTAMP
```

### flights table (new fields)
```sql
delay_minutes INT
new_departure_time DATETIME
cancellation_reason VARCHAR(255)
```

## Benefits
1. **Automatic Updates** - No manual intervention needed
2. **Real-Time Alerts** - Passengers notified immediately
3. **Missed Flight Detection** - System automatically identifies missed passengers
4. **Audit Trail** - All status changes logged
5. **Scalable** - Works for 1 or 1000 passengers
6. **Reliable** - Notifications delivered via heartbeat sync

## Future Enhancements
- SMS/Email notifications
- Push notifications to mobile app
- Automatic rebooking suggestions for missed flights
- Gate change notifications
- Weather-based delay predictions
