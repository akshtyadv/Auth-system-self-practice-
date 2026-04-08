const express=require('express');
const jwt=require('jsonwebtoken')
const JWT_SECRET="database";
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://Akshat:akshat%40l.96pveuk.mongodb.net/")
const { UserModel,TodoModel } = require('./db');

const app= express();

app.use(express.json());

app.post("/signup",async function (req,res)
{
    const email=req.body.email;
    const password=req.body.password;
    const name=req.body.name;

    await UserModel.create({
        email:email,
        password:password,
        name:name
    });

    res.json({
        message:"you are signed up"})
});

app.post("/signin",async function (req,res)
{
    let email=req.body.email;
    let password=req.body.password;

    const response= await UserModel.findOne({
        email:email,
        password:password
    });
    console.log(response);

    if(response)
    {
        const token=jwt.sign({
             id:response._id.toString()}
             ,JWT_SECRET);
        
             res.json({
                token
             })
        
    }
    else{
        res.status(403).json(
            {
                message:"incorrect credentials"
            }
        )
    }

});

app.post("/todo",auth,async function (req,res)
{
    const userId=req.userid;
    const title=req.body.title;
    const done=req.body.done;

    await TodoModel.create({
        title,
        done,
        userId
    })
    res.send("todo added")
})

app.get("/todos",auth,async function (req,res)
{
    const userId=req.userid
    
    const todos= await TodoModel.find({userId})

    res.json({todos});

})

function auth(req,res,next)
{
    const token=req.headers.token;
    const response=jwt.verify(token,JWT_SECRET);

    if(response)
    {
        req.userid=response.id;
        next();
    }
    else{
        res.status(403).json({
            message:"incorrect credentials"
        })
    }
}

app.listen(3000,()=>
{
    console.log("server running on PORT 3000");
})