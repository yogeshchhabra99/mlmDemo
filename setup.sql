CREATE TABLE users (id VARCHAR, name VARCHAR, email VARCHAR, createdAt DATETIME, pwd VARCHAR, ref_code VARCHAR, PRIMARY KEY (id) );

CREATE TABLE userRelation (userId VARCHAR, parentId VARCHAR, relation ENUM('LEFT', 'RIGHT'), FOREIGN KEY(userId) REFERENCES users(id), FOREIGN KEY(ParentId) REFERENCES users(id));

CREATE TABLE userWallet(userId VARCHAR, balance DOUBLE(20,6), updatedAt DATETIME, FOREIGN KEY(userId) REFERENCES users(id))

CREATE TABLE userTransactions(userId VARCHAR,amount DOUBLE(20,6), transactionType ENUM('DEBIT','CREDIT'), transactionTime DATETIME, closingBalance DOUBLE(20,6), FOREIGN KEY(userId) REFERENCES users(id))