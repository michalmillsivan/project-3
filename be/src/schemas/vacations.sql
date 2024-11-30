-- CREATE DATABASE IF NOT EXISTS michali_travels;
USE michali_travels;

-- Table 2: Vacations
CREATE TABLE IF NOT EXISTS vacations (
    vacation_id INT AUTO_INCREMENT PRIMARY KEY,
    destination VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image VARCHAR(255)
);

-- Insert vacations
INSERT INTO vacations (destination, description, start_date, end_date, price, image)
VALUES
('Paris, France', 'A romantic getaway to the City of Lights', '2024-12-01', '2024-12-10', 1200.00, 'paris.jpg'),
('Tokyo, Japan', 'Explore the bustling streets of Tokyo and its culture', '2024-11-05', '2024-11-15', 1600.00, 'tokyo.jpg'),
('Sydney, Australia', 'Discover the beauty of Sydney\'s beaches', '2024-12-20', '2024-12-30', 2000.00, 'sydney.jpg'),
('New York, USA', 'Experience the Big Apple like never before', '2024-10-25', '2024-11-01', 2500.00, 'newyork.jpg'),
('Rome, Italy', 'Walk through history in the Eternal City', '2024-11-10', '2024-11-18', 1400.00, 'rome.jpg'),
('Berlin, Germany', 'A modern city with rich history and culture', '2024-12-05', '2024-12-15', 1300.00, 'berlin.jpg'),
('Rio de Janeiro, Brazil', 'Enjoy the vibrant city of Rio and its beaches', '2024-11-20', '2024-11-28', 1800.00, 'rio.jpg'),
('Cape Town, South Africa', 'Safari adventure and breathtaking landscapes', '2024-12-01', '2024-12-09', 1700.00, 'capetown.jpg'),
('Dubai, UAE', 'Luxury and adventure in the desert', '2024-11-30', '2024-12-07', 2200.00, 'dubai.jpg'),
('Bangkok, Thailand', 'Enjoy the bustling streets and temples of Bangkok', '2024-10-15', '2024-10-25', 1100.00, 'bangkok.jpg'),
('Bali, Indonesia', 'Relax in paradise on the island of Bali', '2024-12-15', '2024-12-25', 1400.00, 'bali.jpg'),
('Amsterdam, Netherlands', 'Explore the canals and culture of Amsterdam', '2024-11-01', '2024-11-09', 1500.00, 'amsterdam.jpg');
