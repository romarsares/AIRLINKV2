create documenation for each function and changes, dont too long make it short for tracking 
# AmazonQ Rules Documentation
create documentaion for evevery update and changes on the documentations
patch notes update per date and auto assign task number
ex. 0001 - patch update no. 1 - "commit"

## Version History

### Patch 0001 - 2024-01-15
**Task**: Add Airport Support to AirLink System
**Changes**: 
- Added airports table with airport_code, airport_name, city, country, timezone
- Updated flights table to include origin_airport_id foreign key
- Updated servers table to include airport_id foreign key
- Set General Santos International Airport (GES) as default airport
- Added performance indexes for airport relationships

### Patch 0002 - 2024-01-15
**Task**: Default Data for General Santos International Airport
**Changes**:
- Inserted sample passenger: Juan Dela Cruz
- Inserted sample flight: PR123 from GES to Manila
- Inserted sample bracelet: GES001
- Inserted sample booking linking all components
- Added GES airport server configuration
- Created initial sync log entry

### Patch 0003 - 2024-01-15
**Task**: Add User Authentication System
**Changes**:
- Added users table with username, password_hash, role, full_name, email
- Inserted default admin user (username: admin, password: admin12354)
- Inserted default operator user (username: operator, password: operator123)
- Added indexes for username and role lookups
- SHA-256 password hashing implementation