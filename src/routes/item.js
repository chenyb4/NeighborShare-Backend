const express=require('express');
const router=express.Router();
const Item=require('../database/models/Item');
const itemController=require("../controllers/item")

const isLoggedIn = require('../middleware/is-logged-in');

const multer = require('multer');

// Multer configuration for handling image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


//get all
router.get('',isLoggedIn,itemController.getAllItems);


//get one by id
router.get('/:itemId',itemController.getItemById);


//post
router.post('',isLoggedIn,upload.single('file'),itemController.addItem);



//update
router.put('/:itemId',isLoggedIn,upload.single('file'),itemController.editItem);


//delete
router.delete('/:itemId', isLoggedIn,itemController.deleteItem);

router.patch('/:itemId',isLoggedIn,upload.single('file'),itemController.patchItem);



module.exports=router;
