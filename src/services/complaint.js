const Complaint = require("../database/models/Complaint");
const jwt = require('jsonwebtoken');
const User = require("../database/models/User");
const {getTokenFromRequest} = require("./utils/helperFunctions");
const {startSession} = require("mongoose");

const logger=require("../utils/logger")

exports.getAllComplaints=async (req, res) => {
    try {
        const complaints = await Complaint.find();
        res.json(complaints);
    } catch (e) {
        logger.error(e.message);
        res.status(400).json({error: e.message});
    }
}


exports.getComplaintById=async (req,res)=>{
    const complaintId = req.params.complaintId;

    try {
        Complaint.findById(complaintId)
            .then(complaint => {
                if (!complaint) {
                    return res.status(404).json({ error: 'Complaint not found' });
                }
                res.json(complaint);
            })
            .catch(err => res.status(400).json({ error: err.message }));
    }catch (e) {
        logger.error(e.message);
        res.status(400).json({ error: e.message });
    }
}


exports.addComplaint = async (req, res) => {
    const session = await startSession();

    try {
        await session.withTransaction(async () => {
            // Extract fields from request body
            const { for_item_id, description, title } = req.body;

            // Check if all required fields are provided
            if (!for_item_id || !description || !title) {
                throw new Error("for_item_id, description, and title are required.");
            }

            // Decode token payload to get user email
            const token = getTokenFromRequest(req);
            const tokenPayload = jwt.decode(token);
            if (!tokenPayload || !tokenPayload.email) {
                throw new Error("Invalid token payload.");
            }

            // Find the user by email within the session
            const user = await User.findOne({ email: tokenPayload.email }).session(session);
            if (!user) {
                throw new Error("User not found.");
            }

            // Check if title contains spaces
            if (title.includes(" ")) {
                throw new Error("Complaint title cannot contain spaces.");
            }

            // Create new complaint
            const newComplaint = new Complaint({
                by_user_id: user._id,
                for_item_id,
                description,
                title
            });

            // Save complaint to database within the session
            const savedComplaint = await newComplaint.save({ session });

            res.status(201).json({ complaint: savedComplaint });
        });
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ error: error.message });
    } finally {
        session.endSession();
    }
};


exports.editComplaint = async (req, res) => {
    const complaintId = req.params.complaintId;

    const session = await startSession();

    try {
        await session.withTransaction(async () => {
            // Extract is_resolved from request body
            const { is_resolved } = req.body;

            // Check if is_resolved is provided
            if (typeof is_resolved === 'undefined') {
                throw new Error('Only the is_resolved field can be edited.');
            }

            // Update the is_resolved field within the session
            const updatedComplaint = await Complaint.findByIdAndUpdate(
                complaintId,
                { is_resolved },
                { new: true, session }
            );

            if (!updatedComplaint) {
                throw new Error('Complaint not found');
            }

            res.json(updatedComplaint);
        });
    } catch (error) {
        logger.error(error.message);
        res.status(400).json({ error: error.message });
    } finally {
        session.endSession();
    }
};




exports.deleteComplaint = async (req, res) => {
    const complaintId = req.params.complaintId;

    const session = await startSession();

    try {
        await session.withTransaction(async () => {
            // Find and delete the complaint within the transaction
            const complaint = await Complaint.findOneAndDelete({ _id: complaintId }, { session });

            if (!complaint) {
                throw new Error('Complaint not found');
            }

            res.json({ message: 'Complaint removed successfully' });
        });
    } catch (error) {
        logger.error(error.message);
        res.status(400).json({ error: error.message });
    } finally {
        session.endSession();
    }
};











