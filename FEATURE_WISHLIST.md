# AirLink System - Feature Wishlist

## Future Enhancements (Pending Approval)

### 🔔 SMS Notification System
**Priority**: Medium  
**Status**: Proposed  
**Description**: Send SMS notifications to passengers after bracelet scanning events

#### Features:
- **Successful Boarding**: "✅ Boarding confirmed for Flight AA123. Gate B12. Departure: 14:30"
- **Failed Verification**: "❌ Bracelet verification failed. Please visit check-in counter"
- **Gate Changes**: "🚪 Gate changed from B12 to C15 for Flight AA123"
- **Flight Delays**: "⏰ Flight AA123 delayed by 30 minutes. New departure: 15:00"

#### Technical Implementation:
- Integration with Twilio SMS API or AWS SNS
- Add SMS service to `braceletController.js` verification flow
- Store SMS preferences in passenger profile
- SMS delivery status logging

#### Requirements:
- SMS service account (Twilio/AWS)
- Phone number validation
- Cost consideration (~$0.01-0.05 per SMS)
- Opt-in/opt-out functionality

#### Estimated Development Time: 2-3 days

---

### 📱 Mobile App Interface
**Priority**: Low  
**Status**: Future Consideration  
**Description**: Native mobile app for passengers and staff

---

### 📊 Advanced Analytics Dashboard
**Priority**: Low  
**Status**: Future Consideration  
**Description**: Data visualization and reporting enhancements

---

### 🔄 Real-time WebSocket Updates
**Priority**: Medium  
**Status**: Future Consideration  
**Description**: Live dashboard updates without page refresh

---

## Notes:
- Current system focuses on core functionality
- SMS notifications are enhancement, not core requirement
- All wishlist items require separate approval and development cycles
- Features will be prioritized based on user feedback and business needs