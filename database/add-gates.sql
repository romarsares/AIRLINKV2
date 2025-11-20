-- Add gates table to database schema
USE airlink_dev;

-- Gates table
CREATE TABLE IF NOT EXISTS gates (
    gate_id INT AUTO_INCREMENT PRIMARY KEY,
    gate_no VARCHAR(10) NOT NULL UNIQUE,
    airport_id INT NOT NULL,
    status VARCHAR(20) DEFAULT 'Active',
    terminal VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (airport_id) REFERENCES airports(airport_id)
);

-- Insert default gates for GES airport
INSERT INTO gates (gate_no, airport_id, terminal) VALUES
('A12', 1, 'A'),
('A13', 1, 'A'),
('A14', 1, 'A'),
('B01', 1, 'B'),
('B02', 1, 'B'),
('B03', 1, 'B'),
('G1', 1, 'G'),
('G2', 1, 'G'),
('G3', 1, 'G');

-- Gate sessions table to track current scanner assignments
CREATE TABLE IF NOT EXISTS gate_sessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    gate_no VARCHAR(10) NOT NULL,
    scanner_ip VARCHAR(50),
    assigned_by VARCHAR(50),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'Active',
    UNIQUE KEY unique_gate_session (gate_no, status),
    FOREIGN KEY (gate_no) REFERENCES gates(gate_no)
);