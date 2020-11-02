var mysql      = require('mysql');
const express = require('express')
const app = express()
const Joi = require('joi');
app.use(express.json());
const sql = require('mssql')

function validateSignUp(body){
    const schema=Joi.object({
        userName:Joi.string().min(1).required(),
        emailId: Joi.string().min(1).required(),
        mobile:Joi.string().allow(""),
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

async function addBalance(id,amount){
    query=`SELECT * from userWallet WHERE userId='${id}'`;
    new sql.Request().query(query, function(error,results){
        if(error){
            console.log(error);
        }
        if(results){
            balance = results.recordset[0].balance;
            balance=balance+amount;
            query=`INSERT INTO userTransactions VALUES('${id}',${amount},'DEBIT',GETDATE(),'${balance}')`
            new sql.Request().query(query, function(error,results){
                if(error){
                    console.log(error);
                }
                if(results){
                    query = `UPDATE userWallet SET balance=${balance} WHERE userId='${id}'`;
                    new sql.Request().query(query, function(error,results){
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
    new sql.Request().query(query, function(error,results){
        if(error)
         console.log(error)
        if(results && results.recordset.length!=0){
            addBalance(results.recordset[0].parentId,200);
            query=`SELECT parentId from userRelation WHERE userId='${results.recordset[0].parentId}'`;
            new sql.Request().query(query, function(error,results){
                if(error)
                console.log(error)
                if(results && results.recordset.length!=0){
                    addBalance(results.recordset[0].parentId,150);
                    query=`SELECT parentId from userRelation WHERE userId='${results.recordset[0].parentId}'`;
                    new sql.Request().query(query, function(error,results){
                        if(error)
                        console.log(error)
                        if(results && results.recordset.length!=0){
                            addBalance(results.recordset[0].parentId,100);
                            query=`SELECT parentId from userRelation WHERE userId='${results.recordset[0].parentId}'`;
                            new sql.Request().query(query, function(error,results){
                                if(error)
                                console.log(error)
                                if(results && results.recordset.length!=0){
                                    addBalance(results.recordset[0].parentId,50);
                                    query=`SELECT parentId from userRelation WHERE userId='${results.recordset[0].parentId}'`;
                                    new sql.Request().query(query, function(error,results){
                                        if(error)
                                        console.log(error)
                                        if(results && results.recordset.length!=0){
                                            addBalance(results.recordset[0].parentId,25);
                                            query=`SELECT parentId from userRelation WHERE userId='${results.recordset[0].parentId}'`;
                                            new sql.Request().query(query, function(error,results){
                                                if(error)
                                                console.log(error)
                                                if(results && results.recordset.length!=0){
                                                    addBalance(results.recordset[0].parentId,10);
                                                    query=`SELECT parentId from userRelation WHERE userId='${results.recordset[0].parentId}'`;
                                                    new sql.Request().query(query, function(error,results){
                                                        if(error)
                                                        console.log(error)
                                                        if(results && results.recordset.length!=0){
                                                            addBalance(results.recordset[0].parentId,5);

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
    query=`INSERT INTO users(id,userName,email,createdAt,pwd,ref_code,mobile,accActive,lastLogonTime) VALUES(NEWID(),'${req.body.userName}','${req.body.emailId}',GETDATE(),'${req.body.password}','${ref_code.code}','${req.body.mobile}',1,GETDATE()) `;
    new sql.Request().query(query, function(error,results){
        if(error){
            console.log(error);
        }
        else{
            console.log(results);
            
            
                query=`SELECT id from users where email='${req.body.emailId}'`
                new sql.Request().query(query, function(error,results){
                    if(error){
                        console.log(error);
                    }else{
                        query=`INSERT INTO userWallet VALUES('${results.recordset[0].id}',0,GETDATE())`;
                        new sql.Request().query(query, function(error,results){
                            if(error){
                                console.log(error);
                            }
                        });
                        if(relation){
                        query=`INSERT INTO userRelation VALUES('${results.recordset[0].id}','${parentId}','${relation}')`
                        new sql.Request().query(query, function(error,results){
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
            
            res.status(200).send({
               success:true,
               message:`User Created successfully, referral Code=${ref_code.code}` 
            })
        }
    });
}

function checkRefCode(req,res){

    if(!req.body.referralCode || req.body.referralCode.length==0){
        handleSignup(req,res,null,null );
        return;
    }
    query=`SELECT id from users where ref_code='${req.body.referralCode}'`
    new sql.Request().query(query, function(error,results){
        if(error){
            console.log(error);
        }
        else{
            console.log(results);
            if(results.recordset.length==0){
                res.status(200).send({success:false,message:"Invalid Referral Code"});
                return;
            }
            userId=results.recordset[0].id;
            query=`SELECT count(*) as count from userRelation where parentId='${userId}'`;
            new sql.Request().query(query, function(error,results){
                if(error){
                    console.log(error);
                }
                else{
                    console.log(results.recordset[0].count);
                    if(results.recordset[0].count==0){
                        //add left
                        handleSignup(req,res,'LEFT',userId);
                    }
                    else if(results.recordset[0].count==1){
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
    new sql.Request().query(query, function(error,results){
        if(error){
            console.log(error);
        }
        else{
            if(results.recordset[0].count!=0){
                getNewRefCode(req,res);
            }
            else{
                checkRefCode(req,res);
            }
        }
    })
}

function getGraph(id,req,res){
    query=`SELECT * from users where id='${id}'`;
}

app.get('/graph/:email',function(req,res){
    console.log(req.params);
    query=`SELECT id from users where email='${req.params.email}'`;
    new sql.Request().query(query, function(error,results){
        if(error){
            console.log(error)
        }
        if(results && results.recordset.length!=0){
            userId=results.recordset[0].id;
            graph=getGraph(userId);
            res.status(200).send({success:true,graph:graph});;
        }
        else{
            res.status(400).send({success:false,message:"Internal Server Error"});
        }
    })
    
})

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
    new sql.Request().query(query, function(error,results){
        if (error)
        res.status(400).send({
            success: false,
            error: "Database Error"
        });
        else{
            if(results.recordset[0].count!=0){
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

port=process.env.PORT || 3000;
   
app.listen(port)
  
console.log("Listening at port"+port);