CREATE DATABASE IF NOT EXISTS michali_travels;
USE michali_travels;

-- Table 3: Followers (with foreign keys to users and vacations)
CREATE TABLE IF NOT EXISTS followers (
    user_id INT,
    vacation_id INT,
    PRIMARY KEY (user_id, vacation_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (vacation_id) REFERENCES vacations(vacation_id) ON DELETE CASCADE
);

INSERT INTO `michali_travels`.`followers` (`user_id`, `vacation_id`) VALUES ('1', '1');