const express=require('express');
const router=express.Router();
const Apartment=require('../models/Apartment');


router.get('',async (req,res)=>{
   try{
       const apartments=await Apartment.find();
       res.json(apartments);
   }catch (err){
       res.json({message:err});
   }
});


module.exports=router;
