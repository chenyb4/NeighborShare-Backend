const Item = require("../database/models/Item");
const {getTokenFromRequest} = require("./utils/helperFunctions");
const jwt = require('jsonwebtoken');
const User = require("../database/models/User");


exports.getAllItems=async (req,res)=>{
    try{
        const items=await Item.find();
        res.json(items);
    }catch (e){
        res.status(400).json({ error: e.message });
    }
}

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
    try {
        // Extract token from request
        const token = getTokenFromRequest(req);

        const tokenPayload = jwt.decode(token);

        console.log(tokenPayload);
        console.log(tokenPayload.apartment_id);

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
            return res.status(400).json({ error: "All fields are required. name, description, apartmentNumber, isAvailable" });
        }

        // Create new item
        const newItem = new Item({
            name,
            ownerEmail,
            description,
            apartmentNumber,
            isAvailable
        });

        // Save item to database
        const savedItem = await newItem.save();

        res.json(savedItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.editItem=async (req,res)=>{
    const itemId = req.params.itemId;

    try{
        Item.findByIdAndUpdate(itemId, req.body, { new: true })
            .then(updatedItem => {
                if (!updatedItem) {
                    return res.status(404).json({ error: 'Item not found' });
                }
                res.json(updatedItem);
            })
            .catch(err => res.status(400).json({ error: err.message }));
    }catch (e) {
        res.status(400).json({ error: e.message });
    }
}


exports.deleteItem=async (req,res)=>{
    const itemId = req.params.itemId;

    console.log("itemid"+itemId)

    try{
        Item.findOneAndDelete({ _id: itemId })
            .then(item => {
                if (!item) {
                    return res.status(404).json({ error: 'Item not found' });
                }
                res.json({ message: 'Item removed successfully' , item});
            })
            .catch(err => res.status(400).json({ error: err.message }));
    }catch (e) {
        res.status(400).json({ error: e.message });
    }
}
