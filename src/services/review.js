
const { StatusCodes } = require("http-status-codes");
const Review = require("../database/models/Review");
const User = require("../database/models/User");
const jwt = require('jsonwebtoken');
const {getTokenFromRequest} = require("./utils/helperFunctions");
const mongoose = require("mongoose");

const logger=require("../utils/logger")

exports.getAllReviews=async (req, res) => {
    try {
        const reviews = await Review.find();
        res.json(reviews);
    } catch (e) {
        logger.error(e.message);
        res.status(400).json({error: e.message});
    }
}


exports.getReviewById=async (req,res)=>{
    const reviewId = req.params.reviewId;

    try {
        Review.findById(reviewId)
            .then(review => {
                if (!review) {
                    return res.status(404).json({ error: 'Review not found' });
                }
                res.json(review);
            })
            .catch(err => res.status(400).json({ error: err.message }));
    }catch (e) {
        logger.error(e.message);
        res.status(400).json({ error: e.message });
    }
}


exports.addReview = async (req, res) => {
    // Extract required fields from request body
    const { for_user_id, content } = req.body;

    // Validate the required fields
    if (!for_user_id || !content) {
        return res.status(400).json({ error: "for_user_id and content are required." });
    }

    const session=await mongoose.startSession();

    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };


    try {
        // Extract token from request
        const token = getTokenFromRequest(req);
        const tokenPayload = jwt.decode(token);

        // Validate the token payload
        if (!tokenPayload || !tokenPayload.email) {
            return res.status(400).json({ error: "Invalid token payload." });
        }

        // Find the user by email from the token payload
        const user = await User.findOne({ email: tokenPayload.email });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Create new review
        const newReview = new Review({
            for_user_id,
            by_user_id: user._id.toString(),
            content
        });

        // Save review to database
        const transactionResults=await session.withTransaction(async ()=>{
            await newReview.save({session});
            res
                .status(StatusCodes.CREATED)
                .send(newReview);

        },transactionOptions)

    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ error: error.message });
    }
};


exports.editReview = async (req, res) => {
    const reviewId = req.params.reviewId;
    const { content } = req.body;

    try {
        // Check if content is provided
        if (!content) {
            return res.status(400).json({ error: 'Content is required to update the review.' });
        }

        // Start a session
        const session = await mongoose.startSession();

        try {
            // Begin a transaction
            await session.startTransaction();

            // Update the review's content within the transaction
            const updatedReview = await Review.findByIdAndUpdate(
                reviewId,
                { content },
                { new: true, session }
            );

            // Check if the review was found and updated
            if (!updatedReview) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ error: 'Review not found' });
            }

            // Commit the transaction
            await session.commitTransaction();
            session.endSession();

            // Send the updated review as a response
            res.json(updatedReview);
        } catch (error) {
            logger.error(error.message);
            // If an error occurs, abort the transaction
            await session.abortTransaction();
            session.endSession();
            // Handle the error
            throw error; // Propagate the error to the outer catch block
        }
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ error: error.message });
    }
};


exports.deleteReview = async (req, res) => {
    const reviewId = req.params.reviewId;

    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            const review = await Review.findByIdAndDelete(reviewId).session(session);

            if (!review) {
                return res.status(404).json({ error: 'Review not found' });
            }

            res.json({ message: 'Review removed successfully' });
        });

        session.endSession();
    } catch (error) {
        logger.error(error.message);
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ error: error.message });
    }
};













