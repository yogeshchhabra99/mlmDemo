const sql = require('mssql')
 

async function setupUsersTable(){
    query = `CREATE TABLE users (
            id VARCHAR(40),
            username VARCHAR(30),
            email VARCHAR(30),
            createdAt DATETIME,
            pwd VARCHAR(30),
            ref_code VARCHAR(30),
            mobile VARCHAR(10),
            lastLogonTime DATETIME,
            address VARCHAR(120),
            profilePic VARCHAR(40),
            accActive BIT,
            blankf1 VARCHAR(30),
            blankf2 VARCHAR(30),
            blankf3 VARCHAR(30),
            PRIMARY KEY (id),
            UNIQUE(email),
            UNIQUE(ref_code))`;

    new sql.Request().query(query,function(error,results){
        if(error){
            console.log(error);
        }
        if(results){
            console.log(results);
        }
    })
}

async function setupUserRelationTable(){
    query = `CREATE TABLE userRelation (userId VARCHAR(40), parentId VARCHAR(40), relation VARCHAR(10), FOREIGN KEY(userId) REFERENCES users(id), FOREIGN KEY(parentId) REFERENCES users(id))`;

    new sql.Request().query(query,function(error,results){
        if(error){
            console.log(error);
        }
        if(results){
            console.log(results);
        }
    })
}

async function setupUserWalletTable(){
    query = `CREATE TABLE userWallet(userId VARCHAR(40), balance DECIMAL(20,6), updatedAt DATETIME, FOREIGN KEY(userId) REFERENCES users(id))`;

    new sql.Request().query(query,function(error,results){
        if(error){
            console.log(error);
        }
        if(results){
            console.log(results);
        }
    })
}

async function setupUserTransactionsTable(){
    query = `CREATE TABLE userTransactions (
        userId VARCHAR(40),
        amount DECIMAL(20,6),
        transactionType VARCHAR(10),
        transactionTime DATETIME,
        closingBalance DECIMAL(20,6),
        FOREIGN KEY(userId) REFERENCES users(id))`;

    new sql.Request().query(query,function(error,results){
        if(error){
            console.log(error);
        }
        if(results){
            console.log(results);
        }
    })
}

async function setup(){
    await sql.connect('mssql://apjindiashop:9782960150@mM@5.226.138.48/apjindiashop')
    //setupUsersTable();
    //setupUserRelationTable();
    //setupUserTransactionsTable();
    //setupUserWalletTable();

}

setup();