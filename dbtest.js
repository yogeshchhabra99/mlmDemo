const sql = require('mssql')
 
console.log("haha");
async function fun() {
    console.log("seup");
    try {
        
        // make sure that any items are correctly URL encoded in the connection string
        await sql.connect('mssql://apjindiashop:/apjindiashop')
        //const result = await sql.query`insert INTO testTable(testField) VALUES('Chhabra here')`
        new sql.Request().query(`SELECT * from users`,(err,results)=>{
            if(err)
                console.log(err);
            console.log(results)
        })
        //console.dir(result)
    } catch (err) {
        // ... error checks
        console.log(err);
    }
}

fun();