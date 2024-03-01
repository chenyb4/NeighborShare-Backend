const express=require('express');
const router=express.Router();
const Item=require('../models/Item');


router.get('',async (req,res)=>{
    try{
        const items=await Item.find();
        res.json(items);
    }catch (err){
        res.json({message:err});
    }
});




module.exports=router;
