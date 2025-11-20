# AirLink Database Setup Guide

## Quick Setup Options

### Option 1: Clean Environment (Production)
```bash
mysql -u airlink_user -psecure_password < setup-clean.sql
```

### Option 2: Development with Test Data
```bash
mysql -u airlink_user -psecure_password < setup-with-data.sql
```

### Option 3: Full Development Setup (Recommended)
```bash
# 1. Setup with test data
mysql -u airlink_user -psecure_password < setup-with-data.sql

# 2. Assign bracelets to simulate check-in
mysql -u airlink_user -psecure_password airlink_dev < assign-bracelets.sql
```

## Database Reset
```bash
mysql -u airlink_user -psecure_password < reset-database.sql
```

## What Each Script Does

### setup-clean.sql
- Creates all tables and indexes
- Adds default airport (GES)
- Creates admin/operator users
- No test data - ready for production

### setup-with-data.sql
- Everything from setup-clean.sql
- 10 passengers with diverse backgrounds
- 10 flights (domestic and international)
- 5 bracelets (all inactive initially)
- 10 bookings (no bracelets assigned yet)

### assign-bracelets.sql
- Assigns GES001-GES003 to first 3 passengers
- Activates assigned bracelets
- Creates sync logs for assignments
- Simulates real check-in process

### Test Data Summary
After running setup-with-data.sql + assign-bracelets.sql:

**Assigned Bracelets:**
- GES001 → Juan Dela Cruz (PR123 to Manila, Gate G1)
- GES002 → Maria Santos (PR124 to Cebu, Gate G2)  
- GES003 → John Smith (5J456 to Davao, Gate G3)

**Available Bracelets:**
- GES004 → Inactive (Low battery 15%)
- GES005 → Inactive (Ready for assignment)

**Unassigned Passengers:**
- 7 passengers with confirmed bookings waiting for check-in

This setup follows the AirLink workflow:
1. Passengers book flights
2. Check-in assigns bracelets
3. Bracelets sync with server
4. Boarding verification at gates