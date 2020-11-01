CREATE TABLE users (id VARCHAR(40), username VARCHAR(30), email VARCHAR(30), createdAt DATETIME, pwd VARCHAR(30), ref_code VARCHAR(30), PRIMARY KEY (id) );

CREATE TABLE userRelation (userId VARCHAR(30), parentId VARCHAR(30), relation ENUM('LEFT', 'RIGHT'), FOREIGN KEY(userId) REFERENCES users(id), FOREIGN KEY(parentId) REFERENCES users(id));

CREATE TABLE userWallet(userId VARCHAR(30), balance DOUBLE(20,6), updatedAt DATETIME, FOREIGN KEY(userId) REFERENCES users(id));

CREATE TABLE userTransactions(userId VARCHAR(30),amount DOUBLE(20,6), transactionType ENUM('DEBIT','CREDIT'), transactionTime DATETIME, closingBalance DOUBLE(20,6), FOREIGN KEY(userId) REFERENCES users(id));