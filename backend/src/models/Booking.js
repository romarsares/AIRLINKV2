// Database pool used across all booking operations
const { pool } = require('../config/database');

class Booking {
  static async create(passengerData, flightNo, seatNo) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Insert or get passenger
      const [passengerResult] = await connection.execute(
        'INSERT INTO passengers (name, email, contact_no, nationality) VALUES (?, ?, ?, ?)',
        [passengerData.name, passengerData.email, passengerData.contact_no, passengerData.nationality]
      );
      
      // Get flight
      const [flights] = await connection.execute(
        'SELECT flight_id FROM flights WHERE flight_no = ?',
        [flightNo]
      );
      
      if (flights.length === 0) {
        throw new Error('Flight not found');
      }
      
      // Create booking
      const [bookingResult] = await connection.execute(
        'INSERT INTO bookings (passenger_id, flight_id, seat_no, booking_status) VALUES (?, ?, ?, ?)',
        [passengerResult.insertId, flights[0].flight_id, seatNo, 'Confirmed']
      );
      
      await connection.commit();
      return { booking_id: bookingResult.insertId, status: 'Confirmed' };
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
  
  static async findById(bookingId) {
    const [rows] = await pool.execute(
      `SELECT b.*, p.name, p.email, f.flight_no, f.destination 
       FROM bookings b 
       JOIN passengers p ON b.passenger_id = p.passenger_id 
       JOIN flights f ON b.flight_id = f.flight_id 
       WHERE b.booking_id = ?`,
      [bookingId]
    );
    return rows[0];
  }
}

module.exports = Booking;