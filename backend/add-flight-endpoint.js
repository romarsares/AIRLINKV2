// Add this endpoint to server.js after line 663

app.put('/api/flights/:id/status', async (req, res) => {
    const { id } = req.params;
    const { gate_no, status, delay_minutes, reason } = req.body;

    try {
        // Update flight
        await db.query(
            `UPDATE flights 
             SET gate_no = ?, status = ?, delay_minutes = ?, 
                 cancellation_reason = ?, updated_at = NOW()
             WHERE flight_id = ?`,
            [gate_no, status, delay_minutes, reason, id]
        );

        // Get all passengers on this flight
        const [passengers] = await db.query(
            `SELECT b.booking_id, b.passenger_id, p.passenger_name, br.bracelet_id
             FROM bookings b
             JOIN passengers p ON b.passenger_id = p.passenger_id
             LEFT JOIN bracelets br ON b.booking_id = br.booking_id
             WHERE b.flight_id = ?`,
            [id]
        );

        // Send notifications to all passengers
        let notificationMessage = '';
        if (status === 'Delayed') {
            notificationMessage = `Flight Delayed: ${delay_minutes} minutes. New gate: ${gate_no}`;
        } else if (status === 'Cancelled') {
            notificationMessage = `Flight Cancelled: ${reason}`;
        } else {
            notificationMessage = `Gate Changed to ${gate_no}`;
        }

        for (const passenger of passengers) {
            await db.query(
                `INSERT INTO notifications (booking_id, notification_type, message, created_at)
                 VALUES (?, ?, ?, NOW())`,
                [passenger.booking_id, 'GATE_CHANGE', notificationMessage]
            );
        }

        res.json({
            success: true,
            notifications_sent: passengers.length,
            message: 'Flight updated and passengers notified'
        });

    } catch (error) {
        console.error('Error updating flight:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});
