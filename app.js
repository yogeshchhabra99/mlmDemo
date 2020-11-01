var mysql      = require('mysql');
const express = require('express')
const app = express()
const Joi = require('joi');
app.use(express.json());

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'yogesh',
  password : 'Password@123',
  database : 'MYDB'
});
 
connection.connect();

function validateSignUp(body){
    const schema=Joi.object({
        userName:Joi.string().min(1).required(),
        emailId: Joi.string().min(1).required(),
        password: Joi.string().min(1).required(),
        referralCode: Joi.string().allow("")
    });
    return schema.validate(body);
}

function generate_code(length)
{
    data = [1,2,3,4,5,6,7,8,9,0,'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    var res = '';
   // console.log(data.length);
    for (var i=0;i<length;i++)
    {
        res = res+ data[Math.floor(Math.random()*data.length)];
    }
    return res;
}

function addBalance(id,amount){
    query=`SELECT * from userWallet WHERE userId='${id}'`;
    connection.query(query,function (error, results, fields){
        if(error){
            console.log(error);
        }
        if(results){
            balance = results[0].balance;
            balance=balance+amount;
            query=`INSERT INTO userTransactions VALUES('${id}',${amount},'DEBIT',now(),'${balance}')`
            connection.query(query,function (error, results, fields){
                if(error){
                    console.log(error);
                }
                if(results){
                    query = `UPDATE userWallet SET balance=${balance} WHERE userId='${id}'`;
                    connection.query(query,function (error, results, fields){
                        if(error){
                            console.log(error);
                        }});
                }
            });   
        }
    })
}

function distributeMoney(parentId){
    addBalance(parentId,500);

    query=`SELECT parentId from userRelation WHERE userId='${parentId}'`;
    connection.query(query,function (error,results,fields){
        if(error)
         console.log(error)
        if(results && results.length!=0){
            addBalance(results[0].parentId,200);
            query=`SELECT parentId from userRelation WHERE userId='${results[0].parentId}'`;
            connection.query(query,function (error,results,fields){
                if(error)
                console.log(error)
                if(results && results.length!=0){
                    addBalance(results[0].parentId,150);
                    query=`SELECT parentId from userRelation WHERE userId='${results[0].parentId}'`;
                    connection.query(query,function (error,results,fields){
                        if(error)
                        console.log(error)
                        if(results && results.length!=0){
                            addBalance(results[0].parentId,100);
                            query=`SELECT parentId from userRelation WHERE userId='${results[0].parentId}'`;
                            connection.query(query,function (error,results,fields){
                                if(error)
                                console.log(error)
                                if(results && results.length!=0){
                                    addBalance(results[0].parentId,50);
                                    query=`SELECT parentId from userRelation WHERE userId='${results[0].parentId}'`;
                                    connection.query(query,function (error,results,fields){
                                        if(error)
                                        console.log(error)
                                        if(results && results.length!=0){
                                            addBalance(results[0].parentId,25);
                                            query=`SELECT parentId from userRelation WHERE userId='${results[0].parentId}'`;
                                            connection.query(query,function (error,results,fields){
                                                if(error)
                                                console.log(error)
                                                if(results && results.length!=0){
                                                    addBalance(results[0].parentId,10);
                                                    query=`SELECT parentId from userRelation WHERE userId='${results[0].parentId}'`;
                                                    connection.query(query,function (error,results,fields){
                                                        if(error)
                                                        console.log(error)
                                                        if(results && results.length!=0){
                                                            addBalance(results[0].parentId,5);

                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })      
                                }
                            })
                        }
                    })    
                }
            })        
        }
    })
    
}

function handleSignup(req,res,relation,parentId){
    query=`INSERT INTO users VALUES(UUID(),'${req.body.userName}','${req.body.emailId}',now(),'${req.body.password}','${ref_code.code}') `;
    connection.query(query,function (error, results, fields){
        if(error){
            console.log(error);
        }
        else{
            console.log(results,fields);
            
            
                query=`SELECT id from users where email='${req.body.emailId}'`
                connection.query(query,function (error, results, fields){
                    if(error){
                        console.log(error);
                    }else{
                        query=`INSERT INTO userWallet VALUES('${results[0].id}',0,now())`;
                        connection.query(query,function(error,results,fields){
                            if(error){
                                console.log(error);
                            }
                        });
                        if(relation){
                        query=`INSERT INTO userRelation VALUES('${results[0].id}','${parentId}','${relation}')`
                        connection.query(query,function (error, results, fields){
                            if(error){
                                console.log(error);
                            }else{
                                console.log("user relation added");
                            }})
                        if(relation=="RIGHT"){
                            distributeMoney(parentId);
                        }
                        }
                    }
                })    
            
            res.status(200).send(`User Created successfully, referral Code=${ref_code.code}`)
        }
    });
}

function checkRefCode(req,res){

    if(!req.body.referralCode || req.body.referralCode.length==0){
        handleSignup(req,res,null,null );
        return;
    }
    query=`SELECT id from users where ref_code='${req.body.referralCode}'`
    connection.query(query,function (error, results, fields){
        if(error){
            console.log(error);
        }
        else{
            console.log(results);
            if(results.length==0){
                res.status(200).send({success:false,message:"Invalid Referral Code"});
                return;
            }
            userId=results[0].id;
            query=`SELECT count(*) as count from userRelation where parentId='${userId}'`;
            connection.query(query,function (error, results, fields){
                if(error){
                    console.log(error);
                }
                else{
                    console.log(results[0].count);
                    if(results[0].count==0){
                        //add left
                        handleSignup(req,res,'LEFT',userId);
                    }
                    else if(results[0].count==1){
                        //ad right
                        handleSignup(req,res,'RIGHT',userId);
                    }
                    else{
                        res.status(500).send({succes:false,message:"Cannot use referral code more than 2 times"})
                    }
                }});
        }
    });
}

function getNewRefCode(req,res){
    ref_code={code:generate_code(7)};
    console.log(ref_code);
    query=`SELECT COUNT(*) as count from users WHERE ref_code='${ref_code.code}'`
    connection.query(query,function (error, results, fields){
        if(error){
            console.log(error);
        }
        else{
            if(results[0].count!=0){
                getNewRefCode(req,res);
            }
            else{
                checkRefCode(req,res);
            }
        }
    })
}
app.post('/signup', function (req, res) {
    result = validateSignUp(req.body);
    if(result.error){
        console.log("validation error");
        res.status(400).send({
            success: false,
            error: result.error
        });
        return;
    }
    console.log(req.body)
    query=`SELECT COUNT(*) as count from users WHERE email='${req.body.emailId}'`
    connection.query(query,function (error, results, fields){
        if (error)
        res.status(400).send({
            success: false,
            error: "Database Error"
        });
        else{
            if(results[0].count!=0){
                res.status(400).send({
                    success: false,
                    error: "EmailId exists"
                }); 
            }
            else{
                getNewRefCode(req,res);
            }
        }
    });
})
   
app.listen(3000)
  