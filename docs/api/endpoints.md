# AirLink API Endpoints

## Priority 1 - Critical Operations

### POST /api/bookings
**Create flight booking**
- **Method**: POST
- **URL**: `/api/bookings`
- **Auth**: Required
- **Body**:
```json
{
  "passenger": {
    "name": "John Doe",
    "email": "john@email.com",
    "contact_no": "+1234567890",
    "nationality": "USA"
  },
  "flight_no": "AA101",
  "seat_no": "12A"
}
```
- **Response**: `201 Created`
```json
{
  "booking_id": 1,
  "status": "Confirmed"
}
```

### POST /api/bracelets/assign
**Assign bracelet to passenger**
- **Method**: POST
- **URL**: `/api/bracelets/assign`
- **Auth**: Required (Admin/Operator)
- **Body**:
```json
{
  "booking_id": 1,
  "bracelet_id": "BRC001"
}
```
- **Response**: `200 OK`
```json
{
  "message": "Bracelet assigned successfully",
  "bracelet_id": "BRC001"
}
```

### POST /api/bracelets/verify
**Verify boarding eligibility**
- **Method**: POST
- **URL**: `/api/bracelets/verify`
- **Auth**: Required
- **Body**:
```json
{
  "bracelet_id": "BRC001",
  "gate_no": "A1"
}
```
- **Response**: `200 OK`
```json
{
  "status": "Cleared",
  "passenger_name": "John Doe",
  "flight_no": "AA101",
  "seat_no": "12A"
}
```

## Priority 2-9 - Supporting Operations

### GET /api/bookings/{booking_id}
**Retrieve booking details**

### GET /api/bracelets/{bracelet_id}/status
**Get bracelet status**

### PUT /api/bracelets/{bracelet_id}/sync
**Manual bracelet sync**

### POST /api/bracelets/{bracelet_id}/deactivate
**Deactivate bracelet**

### GET /api/admin/overview
**System overview dashboard**

### GET /api/sync_logs
**Retrieve sync logs**

### POST /api/sync/force
**Force manual server sync**