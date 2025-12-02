# Fix: Passenger Count Showing 0

## Problem
Flight table shows 0 passengers even though passengers are boarded.

## Root Cause
The `/api/flights` endpoint query is not properly counting passengers from the bookings table.

## Solution
Update the flights endpoint query to properly count passengers:

```javascript
app.get('/api/flights', async (req, res) => {
  try {
    const [flights] = await db.execute(`
      SELECT 
        f.*,
        COUNT(b.booking_id) as passenger_count,
        COUNT(CASE WHEN b.booking_status = 'Boarded' THEN 1 END) as boarded_count
      FROM flights f
      LEFT JOIN bookings b ON f.flight_id = b.flight_id
      GROUP BY f.flight_id
      ORDER BY f.departure_time
    `);
    
    res.json(flights);
  } catch (error) {
    console.error('Get flights error:', error);
    res.status(500).json({ error: 'Failed to fetch flights' });
  }
});
```

## What This Does:
1. **passenger_count**: Total passengers booked on flight (all statuses)
2. **boarded_count**: Only passengers with status 'Boarded'
3. **LEFT JOIN**: Ensures flights show even with 0 passengers
4. **GROUP BY**: Aggregates counts per flight

## To Apply:
1. Find line 370 in `backend/server.js`
2. Replace the entire `app.get('/api/flights'...` endpoint with the code above
3. Restart server
4. Refresh dashboard

The passenger count will now show correctly!
