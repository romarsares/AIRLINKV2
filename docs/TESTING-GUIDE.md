# AirLink System Testing Guide

## 🧪 Pre-Commit Testing Checklist

### Environment Setup Verification

#### 1. Database Connection Test
```bash
# Verify MySQL connection
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p"N1mbu$12354" -e "USE airlink_dev; SHOW TABLES;"

# Expected Output: 6 tables (passengers, flights, bracelets, bookings, servers, sync_logs)
```

#### 2. Backend Server Test
```bash
# Start backend server
cd backend
npm run dev

# Expected Output:
# ✅ Database connected successfully
# 🚀 AirLink Server running on port 3002
```

#### 3. Frontend Server Test
```bash
# Start frontend server (new terminal)
cd frontend
npm start

# Expected Output: Browser opens to http://localhost:3001/src
```

---

## 🔐 Authentication Testing

### Test 1: Admin Login
1. **Access**: `http://localhost:3001/src`
2. **Select Role**: Admin
3. **Click**: Login
4. **Expected**: Dashboard loads with all sections visible
5. **Verify**: "Admin" badge in header, Sync Logs tab visible

### Test 2: Operator Login
1. **Select Role**: Operator
2. **Click**: Login
3. **Expected**: Dashboard loads with limited sections
4. **Verify**: "Operator" badge in header, Sync Logs tab hidden

### Test 3: Logout Functionality
1. **Click**: Logout button
2. **Expected**: Returns to login screen
3. **Verify**: All session data cleared

---

## 📊 API Endpoint Testing

### Health Check Test
```bash
# Test server connectivity
curl http://localhost:3002/api/health

# Expected Response:
{
  "status": "OK",
  "service": "AirLink API",
  "timestamp": "2024-XX-XX..."
}
```

### Generate Test Token
```bash
# Generate JWT tokens for testing
cd backend
node generate-token.js

# Copy the Admin token for API testing
```

### Priority 1 Endpoints

#### Test 1: Create Booking
```bash
curl -X POST http://localhost:3002/api/bookings \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "passenger": {
      "name": "Test User",
      "email": "test@example.com",
      "contact_no": "+1234567890",
      "nationality": "USA"
    },
    "flight_no": "AA101",
    "seat_no": "15A"
  }'

# Expected: {"booking_id": X, "status": "Confirmed"}
```

#### Test 2: Assign Bracelet
```bash
curl -X POST http://localhost:3002/api/bracelets/assign \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "booking_id": 1,
    "bracelet_id": "BRC002"
  }'

# Expected: {"message": "Bracelet assigned successfully", "bracelet_id": "BRC002"}
```

#### Test 3: Verify Boarding
```bash
curl -X POST http://localhost:3002/api/bracelets/verify \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bracelet_id": "BRC001",
    "gate_no": "A1"
  }'

# Expected: {"status": "Cleared", "passenger_name": "John Doe", ...}
```

### Supporting Endpoints

#### Test 4: Get Booking
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3002/api/bookings/1

# Expected: Complete booking details with passenger and flight info
```

#### Test 5: Bracelet Status
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3002/api/bracelets/BRC001/status

# Expected: {"bracelet_id": "BRC001", "status": "Active", "battery_level": 85, ...}
```

#### Test 6: System Overview (Admin Only)
```bash
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  http://localhost:3002/api/admin/overview

# Expected: {"total_bookings": X, "active_flights": Y, ...}
```

---

## 🖥️ Frontend Functionality Testing

### Dashboard Navigation Test
1. **Login as Admin**
2. **Click each tab**: Overview, Bookings, Bracelets, Sync Logs
3. **Verify**: Each section loads correctly
4. **Check**: Active tab highlighting works

### Overview Section Test
1. **Navigate to**: Overview tab
2. **Verify**: 4 metric cards display numbers
3. **Click**: Refresh button
4. **Check**: Data updates
5. **Admin Only**: Force Sync button visible and functional

### Bookings Section Test
1. **Navigate to**: Bookings tab
2. **Enter**: Booking ID "1" in search
3. **Click**: Search button
4. **Verify**: Booking details display correctly
5. **Test**: Invalid booking ID shows error

### Bracelets Section Test

#### Assign Bracelet Test
1. **Navigate to**: Bracelets tab
2. **Enter**: Booking ID "2", Bracelet ID "BRC003"
3. **Click**: Assign button
4. **Verify**: Success message appears
5. **Check**: Input fields clear after success

#### Verify Boarding Test
1. **Enter**: Bracelet ID "BRC001", Gate "A1"
2. **Click**: Verify button
3. **Verify**: Boarding status displays (Cleared/Denied)
4. **Check**: Passenger information shown if cleared

#### Bracelet Status Test
1. **Enter**: Bracelet ID "BRC001"
2. **Click**: Check Status button
3. **Verify**: Status, battery level, and sync time display

### Sync Logs Test (Admin Only)
1. **Login as Admin**
2. **Navigate to**: Sync Logs tab
3. **Verify**: Logs display with timestamps
4. **Change**: Filter to "Failed Only"
5. **Check**: Filter functionality works

---

## 📱 Responsive Design Testing

### Desktop Testing (1200px+)
1. **Browser**: Full screen desktop
2. **Verify**: All elements properly spaced
3. **Check**: Navigation horizontal layout
4. **Test**: All functionality works

### Tablet Testing (768px-1199px)
1. **Browser**: Resize to tablet width
2. **Verify**: Layout adapts appropriately
3. **Check**: Navigation remains functional
4. **Test**: Forms remain usable

### Mobile Testing (<768px)
1. **Browser**: Resize to mobile width
2. **Verify**: Single column layout
3. **Check**: Navigation stacks properly
4. **Test**: Touch-friendly button sizes
5. **Verify**: Forms stack vertically

---

## 🔒 Security Testing

### Authentication Security
1. **Test**: Access dashboard without login (should redirect)
2. **Test**: Invalid role selection (should show error)
3. **Test**: Token expiration handling
4. **Test**: Logout clears all session data

### Authorization Testing
1. **Login as Operator**
2. **Verify**: Sync Logs tab hidden
3. **Verify**: Force Sync button hidden
4. **Test**: Direct API calls with Operator token to Admin endpoints (should fail)

### Input Validation Testing
1. **Test**: Empty form submissions (should show validation errors)
2. **Test**: Invalid booking IDs (should show appropriate errors)
3. **Test**: Special characters in inputs (should be handled safely)

---

## 🚀 Performance Testing

### Load Time Testing
1. **Measure**: Initial page load time (<3 seconds)
2. **Test**: API response times (<200ms)
3. **Verify**: Auto-refresh doesn't impact performance
4. **Check**: Memory usage remains stable

### Network Testing
1. **Test**: Slow network conditions
2. **Test**: Network disconnection handling
3. **Verify**: Error messages for connection failures
4. **Check**: Graceful degradation

---

## 🐛 Error Handling Testing

### Backend Error Testing
1. **Test**: Database connection failure
2. **Test**: Invalid API requests
3. **Test**: Authentication failures
4. **Verify**: Proper error messages returned

### Frontend Error Testing
1. **Test**: API server unavailable
2. **Test**: Invalid form submissions
3. **Test**: Network timeouts
4. **Verify**: User-friendly error messages displayed

---

## ✅ Final Integration Test

### Complete Workflow Test
1. **Start**: Both backend and frontend servers
2. **Login**: As Admin
3. **Create**: New booking via API or database
4. **Assign**: Bracelet through dashboard
5. **Verify**: Boarding through dashboard
6. **Check**: Sync logs for audit trail
7. **Test**: Force sync functionality
8. **Logout**: And verify session cleanup

### Cross-Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers

---

## 📋 Testing Checklist Summary

### Backend Testing ✅
- [ ] Database connection established
- [ ] All 9 API endpoints functional
- [ ] Authentication working
- [ ] Error handling proper
- [ ] Logging operational

### Frontend Testing ✅
- [ ] Login/logout flow working
- [ ] All dashboard sections functional
- [ ] API integration complete
- [ ] Responsive design working
- [ ] Role-based access enforced

### Security Testing ✅
- [ ] Authentication required
- [ ] Authorization enforced
- [ ] Input validation working
- [ ] Session management secure

### Performance Testing ✅
- [ ] Load times acceptable
- [ ] API responses fast
- [ ] Auto-refresh working
- [ ] Memory usage stable

**System Status**: Ready for Production Testing ✅