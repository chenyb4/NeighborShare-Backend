const Review = require("../database/models/Review");
const User = require("../database/models/User");
const jwt = require('jsonwebtoken');
const {getTokenFromRequest} = require("./utils/helperFunctions");

exports.getAllReviews=async (req, res) => {
    try {
        const reviews = await Review.find();
        res.json(reviews);
    } catch (e) {
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
        res.status(400).json({ error: e.message });
    }
}


exports.addReview = async (req, res) => {
    try {
        // Extract required fields from request body
        const { for_user_id, content } = req.body;

        // Validate the required fields
        if (!for_user_id || !content) {
            return res.status(400).json({ error: "for_user_id and content are required." });
        }

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
        const savedReview = await newReview.save();

        res.status(201).json({ review: savedReview });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.editReview = async (req, res) => {
    const reviewId = req.params.reviewId;

    try {
        // Extract only the content field from the request body
        const { content } = req.body;

        // Check if content is provided
        if (!content) {
            return res.status(400).json({ error: 'Content is required to update the review.' });
        }

        // Update the review's content
        const updatedReview = await Review.findByIdAndUpdate(
            reviewId,
            { content },
            { new: true }
        );

        // Check if the review was found and updated
        if (!updatedReview) {
            return res.status(404).json({ error: 'Review not found' });
        }

        res.json(updatedReview);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.deleteReview=(req,res)=>{
    const reviewId = req.params.reviewId;

    try{
        Review.findOneAndDelete(reviewId)
            .then(review => {
                if (!review) {
                    return res.status(404).json({ error: 'Review not found' });
                }
                res.json({ message: 'Review removed successfully' });
            })
            .catch(err => res.status(400).json({ error: err.message }));
    }catch (e) {
        res.status(400).json({ error: e.message });
    }
}












