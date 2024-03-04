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

router.post('',async (req,res)=>{

    const {name, ownerEmail, description} = req.body;


    const newItem = new Item({
        name: name,
        ownerEmail: ownerEmail,
        description: description,
    });

    newItem.save()
        .then(item => res.json(item))
        .catch(err => res.status(400).json({ error: err.message }));
});




module.exports=router;
