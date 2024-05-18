const express=require('express');
const router=express.Router();
const Complaint=require('../database/models/Complaint');
const isLoggedIn = require('../middleware/is-logged-in');

const complaintController=require("../controllers/complaint")

//get all
router.get('',complaintController.getAllComplaints);

//get one by id
router.get('/:complaintId', complaintController.getComplaintById);


//create
router.post('', isLoggedIn,complaintController.addComplaint);


//update
router.put('/:complaintId', complaintController.editComplaint);


//delete
router.delete('/:complaintId', complaintController.deleteComplaint);


module.exports=router;
