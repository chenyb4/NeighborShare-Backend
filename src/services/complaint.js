const Complaint = require("../database/models/Complaint");
const jwt = require('jsonwebtoken');
const User = require("../database/models/User");
const {getTokenFromRequest} = require("./utils/helperFunctions");


exports.getAllComplaints=async (req, res) => {
    try {
        const complaints = await Complaint.find();
        res.json(complaints);
    } catch (e) {
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
        res.status(400).json({ error: e.message });
    }
}


exports.addComplaint = async (req, res) => {
    try {
        // Extract fields from request body
        const { for_item_id, description, title } = req.body;

        // Check if all required fields are provided
        if (!for_item_id || !description || !title) {
            return res.status(400).json({ error: "for_item_id, description, and title are required." });
        }

        // Decode token payload to get user email
        const token = getTokenFromRequest(req);
        const tokenPayload = jwt.decode(token);
        if (!tokenPayload || !tokenPayload.email) {
            return res.status(400).json({ error: "Invalid token payload." });
        }

        // Find the user by email
        const user = await User.findOne({ email: tokenPayload.email });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Check if title contains spaces
        if (title.includes(" ")) {
            return res.status(400).json({ error: "Complaint title cannot contain spaces." });
        }



        // Create new complaint
        const newComplaint = new Complaint({
            by_user_id: user._id,
            for_item_id,
            description,
            title
        });

        // Save complaint to database
        const savedComplaint = await newComplaint.save();

        res.status(201).json({ complaint: savedComplaint });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.editComplaint = async (req, res) => {
    const complaintId = req.params.complaintId;

    try {
        // Extract is_resolved from request body
        const { is_resolved } = req.body;

        // Check if is_resolved is provided
        if (typeof is_resolved === 'undefined') {
            return res.status(400).json({ error: 'Only the is_resolved field can be edited.' });
        }

        // Update the is_resolved field
        const updatedComplaint = await Complaint.findByIdAndUpdate(
            complaintId,
            { is_resolved },
            { new: true }
        );

        if (!updatedComplaint) {
            return res.status(404).json({ error: 'Complaint not found' });
        }

        res.json(updatedComplaint);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




exports.deleteComplaint=(req,res)=>{
    const complaintId = req.params.complaintId;

    try{
        Complaint.findOneAndDelete(complaintId)
            .then(complaint => {
                if (!complaint) {
                    return res.status(404).json({ error: 'Complaint not found' });
                }
                res.json({ message: 'Complaint removed successfully' });
            })
            .catch(err => res.status(400).json({ error: err.message }));
    }catch (e) {
        res.status(400).json({ error: e.message });
    }
}












