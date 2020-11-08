drop table userRelation,userWallet,userTransaction;
drop table users;

CREATE TABLE users (id VARCHAR(40),
                    username VARCHAR(30),
                    email VARCHAR(30),
                    createdAt DATETIME,
                    pwd VARCHAR(30),
                    ref_code VARCHAR(30),
                    mobile VARCHAR(10),
                    lastLogonTime DATETIME,
                    address VARCHAR(120),
                    profilePic VARCHAR(40),
                    accActive BOOL,
                    blankf1 VARCHAR(30),
                    blankf2 VARCHAR(30),
                    blankf3 VARCHAR(30),
                    PRIMARY KEY (id),
                    UNIQUE(email),
                    UNIQUE(ref_code) );

CREATE TABLE userRelation (userId VARCHAR(40), 
                            parentId VARCHAR(40), 
                            relation ENUM('LEFT', 
                            'RIGHT'), 
                            FOREIGN KEY(userId) REFERENCES users(id), 
                            FOREIGN KEY(parentId) REFERENCES users(id));

CREATE TABLE userWallet(userId VARCHAR(40), balance DOUBLE(20,6), updatedAt DATETIME, FOREIGN KEY(userId) REFERENCES users(id));

CREATE TABLE userTransactions(userId VARCHAR(40),amount DOUBLE(20,6), transactionType ENUM('DEBIT','CREDIT'), transactionTime DATETIME, closingBalance DOUBLE(20,6), FOREIGN KEY(userId) REFERENCES users(id));

