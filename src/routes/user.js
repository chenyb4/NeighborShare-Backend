const express=require('express');
const router=express.Router();
const User=require('../models/User');
const bcrypt = require("bcrypt");
const {v4:uuidv4}=require('uuid');


router.get('',async (req,res)=>{
    try{
        const users=await User.find();
        res.json(users);
    }catch (err){
        res.json({message:err});
    }
});


router.post('', async (req,res)=>{


    const salt=bcrypt.genSaltSync(10);

    try{

        const user=new User({
            name:req.body.name,
            email:req.body.email,
            passwordHash:req.body.password,

        });



        await user.save()
            .then(data=>{
                res.json(data);
                console.log("success");
            })
            .catch(err=>{
                res.json({message:"something went wrong"});
                console.log("not success")
            })

    }catch (e) {
        res.json({message:e});
        console.log("did post went wrong");
    }
});


module.exports=router;
