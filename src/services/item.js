const Item = require("../database/models/Item");
const {getTokenFromRequest} = require("./utils/helperFunctions");
const jwt = require('jsonwebtoken');
const User = require("../database/models/User");

const imagePlaceholder =require("../assets/constants");
const {startSession} = require("mongoose");

const logger=require("../utils/logger")

//get all the items in my apartment, not really all the items
exports.getAllItems = async (req, res) => {
    try {
        const token = getTokenFromRequest(req);
        const tokenPayload = jwt.decode(token);

        if (!tokenPayload || !tokenPayload.email) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Invalid token payload." });
        }

        // Retrieve user by email from token payload
        const user = await User.findOne({ email: tokenPayload.email });

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found." });
        }

        // Get apartment_id from the user object
        const apartmentId = user.apartment_id;

        // Find all users with the same apartment_id
        const usersWithSameApartment = await User.find({ apartment_id: apartmentId });

        // Extract emails of users with the same apartment_id
        const emails = usersWithSameApartment.map(user => user.email);

        // Find items owned by users with the same apartment_id
        const items = await Item.find({ ownerEmail: { $in: emails } });

        res.json(items);
    } catch (error) {
        logger.error(error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};

exports.getItemById=async (req,res)=>{
    const itemId = req.params.itemId;

    // Find the item by its ID
    Item.findById(itemId)
        .then(item => {
            if (!item) {
                return res.status(404).json({ error: 'Item not found' });
            }
            res.json(item);
        })
        .catch(err => res.status(400).json({ error: err.message }));
}

exports.addItem = async (req, res) => {
    const session = await startSession();

    try {
        await session.withTransaction(async () => {
            // Extract token from request
            const token = getTokenFromRequest(req);

            const tokenPayload = jwt.decode(token);

            if (!tokenPayload || !tokenPayload.email) {
                return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Invalid token payload." });
            }

            // Retrieve user by email from token payload
            const user = await User.findOne({ email: tokenPayload.email });

            if (!user) {
                return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found." });
            }

            // Check if user has an apartment_id
            if (!user.apartment_id) {
                return res.status(403).json({ error: "Forbidden: User does not have an apartment." });
            }

            // Retrieve ownerEmail from token payload
            const ownerEmail = tokenPayload.email;

            // Check if all required fields are provided
            const { name, description, apartmentNumber, isAvailable } = req.body;
            if (!name || !description || !apartmentNumber || !isAvailable) {
                return res.status(400).json({ error: "All fields are required: name, description, apartmentNumber, isAvailable" });
            }

            // Set default image if no image file was uploaded
            let imageData;
            if (req.file) {
                imageData = req.file.buffer;
            } else {
                imageData = Buffer.from(imagePlaceholder.data, "base64");
            }

            // Create new item
            const newItem = new Item({
                name,
                ownerEmail,
                description,
                apartmentNumber,
                isAvailable,
                imageData // Save image data to the item
            });

            // Save item to database within the session
            const savedItem = await newItem.save({ session });

            res.json(savedItem);
        });

        session.endSession();
    } catch (error) {
        logger.error(error.message);
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ error: error.message });
    }
};

//user can only edit their own items
//by verifying the email in token payload whether it
//equals the ownerEmail of an item
exports.editItem = async (req, res) => {
    const itemId = req.params.itemId;
    const token = getTokenFromRequest(req);
    const tokenPayload = jwt.decode(token);

    if (!tokenPayload || !tokenPayload.email) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Invalid token payload." });
    }

    const session = await startSession();

    try {
        await session.withTransaction(async () => {
            // Find the item by itemId within the session
            const item = await Item.findById(itemId).session(session);

            if (!item) {
                return res.status(StatusCodes.NOT_FOUND).json({ error: 'Item not found' });
            }

            // Verify if the user is the owner of the item
            if (item.ownerEmail !== tokenPayload.email) {
                return res.status(StatusCodes.FORBIDDEN).json({ error: "You are not authorized to edit this item." });
            }

            // Update the item within the session
            const updatedItem = await Item.findByIdAndUpdate(itemId, req.body, { new: true }).session(session);

            if (!updatedItem) {
                return res.status(StatusCodes.NOT_FOUND).json({ error: 'Item not found' });
            }

            res.json(updatedItem);
        });

        session.endSession();
    } catch (error) {
        logger.error(error.message);
        await session.abortTransaction();
        session.endSession();
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};


exports.deleteItem = async (req, res) => {
    const itemId = req.params.itemId;
    const token = getTokenFromRequest(req);
    const tokenPayload = jwt.decode(token);

    if (!tokenPayload || !tokenPayload.email) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Invalid token payload." });
    }

    const session = await startSession();

    try {
        await session.withTransaction(async () => {
            // Find the item by itemId within the session
            const item = await Item.findById(itemId).session(session);

            if (!item) {
                return res.status(StatusCodes.NOT_FOUND).json({ error: 'Item not found' });
            }

            // Verify if the user is the owner of the item
            if (item.ownerEmail !== tokenPayload.email) {
                return res.status(StatusCodes.FORBIDDEN).json({ error: "You are not authorized to delete this item." });
            }

            // Delete the item within the session
            const deletedItem = await Item.findOneAndDelete({ _id: itemId }).session(session);

            if (!deletedItem) {
                return res.status(StatusCodes.NOT_FOUND).json({ error: 'Item not found' });
            }

            res.json({ message: 'Item removed successfully', item: deletedItem });
        });

        session.endSession();
    } catch (error) {
        logger.error(error.message);
        await session.abortTransaction();
        session.endSession();
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};


exports.patchItem = async (req, res) => {
    const itemId = req.params.itemId;
    const token = getTokenFromRequest(req);
    const tokenPayload = jwt.decode(token);

    if (!tokenPayload || !tokenPayload.email) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Invalid token payload." });
    }

    const session = await startSession();

    try {
        await session.withTransaction(async () => {
            // Find the item by itemId within the session
            const item = await Item.findById(itemId).session(session);

            if (!item) {
                return res.status(StatusCodes.NOT_FOUND).json({ error: 'Item not found' });
            }

            // Verify if the user is the owner of the item
            if (item.ownerEmail !== tokenPayload.email) {
                return res.status(StatusCodes.FORBIDDEN).json({ error: "You are not authorized to edit this item." });
            }

            // Update the item with the patched data within the session
            const patchedItem = await Item.findByIdAndUpdate(itemId, req.body, { new: true }).session(session);

            if (!patchedItem) {
                return res.status(StatusCodes.NOT_FOUND).json({ error: 'Item not found' });
            }

            res.json(patchedItem);
        });

        session.endSession();
    } catch (error) {
        logger.error(error.message);
        await session.abortTransaction();
        session.endSession();
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};
