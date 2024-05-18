const express=require('express');
const router=express.Router();
const Review=require('../database/models/Review');
const isLoggedIn = require('../middleware/is-logged-in');

const reviewController=require("../controllers/review")

//get all
router.get('',reviewController.getAllReviews);

//get one by id
router.get('/:reviewId', reviewController.getReviewById);

//create
router.post('', isLoggedIn,reviewController.addReview);

//update
router.put('/:reviewId', reviewController.editReview);

//delete
router.delete('/:reviewId', reviewController.deleteReview);


module.exports=router;
