-- Check passenger counts per flight
SELECT 
    f.flight_id,
    f.flight_no,
    f.gate_no,
    f.status,
    COUNT(b.booking_id) as total_bookings,
    COUNT(CASE WHEN b.booking_status = 'Boarded' THEN 1 END) as boarded_count,
    COUNT(CASE WHEN b.assigned_bracelet IS NOT NULL THEN 1 END) as with_bracelet
FROM flights f
LEFT JOIN bookings b ON f.flight_id = b.flight_id
GROUP BY f.flight_id
ORDER BY f.flight_no;
