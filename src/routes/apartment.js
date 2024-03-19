const express=require('express');
const router=express.Router();
const Apartment=require('../models/Apartment');

const apartmentController=require("../controllers/apartment")

//get all
router.get('',apartmentController.getAllApartments);

//get one by id
router.get('/:apartmentId', apartmentController.getApartmentById);


//create
router.post('', apartmentController.addApartment);


//update
router.put('/:apartmentId', apartmentController.editApartment);


//delete
router.delete('/:apartmentId', apartmentController.deleteApartment);


module.exports=router;
