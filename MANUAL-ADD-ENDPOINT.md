# Manual Step: Add Flight Update Endpoint

## Open `backend/server.js` and add this code after line 663:

```javascript
// Update flight status by flight_id
app.put('/api/flights/:id/status', async (req, res) => {
    const { id } = req.params;
    const { gate_no, status, delay_minutes, reason } = req.body;

    try {
        await db.query(
            `UPDATE flights 
             SET gate_no = ?, status = ?, delay_minutes = ?, 
                 cancellation_reason = ?, updated_at = NOW()
             WHERE flight_id = ?`,
            [gate_no, status, delay_minutes, reason, id]
        );

        const [passengers] = await db.query(
            `SELECT b.booking_id FROM bookings b WHERE b.flight_id = ?`,
            [id]
        );

        let notificationMessage = status === 'Delayed' 
            ? `Flight Delayed: ${delay_minutes} min. Gate: ${gate_no}`
            : status === 'Cancelled' 
            ? `Flight Cancelled: ${reason}`
            : `Gate Changed to ${gate_no}`;

        for (const p of passengers) {
            await db.query(
                `INSERT INTO notifications (booking_id, notification_type, message, created_at)
                 VALUES (?, 'GATE_CHANGE', ?, NOW())`,
                [p.booking_id, notificationMessage]
            );
        }

        res.json({
            success: true,
            notifications_sent: passengers.length
        });

    } catch (error) {
        console.error('Error updating flight:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});
```

## Then restart the server:
```
node backend/server.js
```
