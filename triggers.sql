DROP TRIGGER after_user_insert;

CREATE TRIGGER after_user_insert
AFTER INSERT 
ON users FOR EACH ROW
BEGIN
    INSERT INTO userWallet VALUES(new.id, 0, now());

END$$

DELIMITER;