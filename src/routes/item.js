const express=require('express');
const router=express.Router();
const Item=require('../models/Item');


//get all
router.get('',async (req,res)=>{
    try{
        const items=await Item.find();
        res.json(items);
    }catch (e){
        res.status(400).json({ error: e.message });
    }
});


//get one by id
router.get('/:itemId',(req, res) => {
    const itemId = req.params.itemId;

    // Find the item by its ID
    Item.findById(itemId)
        .then(item => {
            if (!item) {
                return res.status(404).json({ error: 'Item not found' });
            }
            res.json(item);
        })
        .catch(err => res.status(400).json({ error: err.message }));
});


//post
router.post('',async (req,res)=>{

    const {name, ownerEmail, description} = req.body;


    const newItem = new Item({
        name: name,
        ownerEmail: ownerEmail,
        description: description,
    });

    try{
        newItem.save()
            .then(item => res.json(item))
            .catch(err => res.status(400).json({ error: err.message }));
    }catch (e) {
        res.status(400).json({ error: e.message });
    }

});



//update
router.put('/:itemId',async (req,res)=>{
    const itemId = req.params.itemId;

    try{
        Item.findByIdAndUpdate(itemId, req.body, { new: true })
            .then(updatedItem => {
                if (!updatedItem) {
                    return res.status(404).json({ error: 'Item not found' });
                }
                res.json(updatedItem);
            })
            .catch(err => res.status(400).json({ error: err.message }));
    }catch (e) {
        res.status(400).json({ error: e.message });
    }
});


//delete
router.delete('/:itemId', (req, res) => {
    const itemId = req.params.itemId;

    try{
        Item.findOneAndDelete(itemId)
            .then(item => {
                if (!item) {
                    return res.status(404).json({ error: 'Item not found' });
                }
                res.json({ message: 'Item removed successfully' });
            })
            .catch(err => res.status(400).json({ error: err.message }));
    }catch (e) {
        res.status(400).json({ error: e.message });
    }

});



module.exports=router;
