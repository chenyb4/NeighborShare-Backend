const express=require('express');
const router=express.Router();
const Item=require('../database/models/Item');
const itemController=require("../controllers/item")


//get all
router.get('',itemController.getAllItems);


//get one by id
router.get('/:itemId',itemController.getItemById);


//post
router.post('',itemController.addItem);



//update
router.put('/:itemId',itemController.editItem);


//delete
router.delete('/:itemId', itemController.deleteItem);



module.exports=router;
