const { pool } = require('../config/database');

class Bracelet {
  static async assign(bookingId, braceletId) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Check if bracelet is available
      const [bracelets] = await connection.execute(
        'SELECT status FROM bracelets WHERE bracelet_id = ?',
        [braceletId]
      );
      
      if (bracelets.length === 0 || bracelets[0].status !== 'Inactive') {
        throw new Error('Bracelet not available');
      }
      
      // Update booking with bracelet
      await connection.execute(
        'UPDATE bookings SET assigned_bracelet = ? WHERE booking_id = ?',
        [braceletId, bookingId]
      );
      
      // Update bracelet status
      await connection.execute(
        'UPDATE bracelets SET status = ? WHERE bracelet_id = ?',
        ['Active', braceletId]
      );
      
      await connection.commit();
      return { message: 'Bracelet assigned successfully', bracelet_id: braceletId };
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
  
  static async verify(braceletId, gateNo) {
    const [rows] = await pool.execute(
      `SELECT b.booking_id, p.name as passenger_name, f.flight_no, b.seat_no, f.gate_no
       FROM bookings b 
       JOIN passengers p ON b.passenger_id = p.passenger_id 
       JOIN flights f ON b.flight_id = f.flight_id 
       WHERE b.assigned_bracelet = ? AND b.booking_status = 'Confirmed'`,
      [braceletId]
    );
    
    if (rows.length === 0) {
      return { status: 'Denied', message: 'Invalid bracelet or booking' };
    }
    
    const booking = rows[0];
    
    // Log verification
    await pool.execute(
      'INSERT INTO sync_logs (bracelet_id, timestamp, sync_status, remarks) VALUES (?, NOW(), ?, ?)',
      [braceletId, 'Success', `Boarding verification at gate ${gateNo}`]
    );
    
    return {
      status: 'Cleared',
      passenger_name: booking.passenger_name,
      flight_no: booking.flight_no,
      seat_no: booking.seat_no
    };
  }
}

module.exports = Bracelet;