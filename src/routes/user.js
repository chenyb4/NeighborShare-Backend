const express=require('express');
const router=express.Router();
const User=require('../models/User');
const bcrypt = require("bcrypt");
const {v4:uuidv4}=require('uuid');
const userController=require("../controllers/user")

//get all
router.get('',userController.getAllUsers);


//get by id
router.get('/:userId', userController.getUserById);


//create
router.post('', userController.addUser);


//update
router.put('/:userId', userController.editUser);


//delete
router.delete('/:userId', userController.deleteUser);




module.exports=router;
