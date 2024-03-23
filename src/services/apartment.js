const Apartment = require("../database/models/Apartment");
const User = require("../database/models/User");
const jwt = require('jsonwebtoken');
const {getTokenFromRequest} = require("./utils/helperFunctions");

exports.getAllApartments=async (req, res) => {
    try {
        const apartments = await Apartment.find();
        res.json(apartments);
    } catch (e) {
        res.status(400).json({error: e.message});
    }
}


exports.getApartmentById=async (req,res)=>{
    const apartmentId = req.params.apartmentId;

    try {
        Apartment.findById(apartmentId)
            .then(apartment => {
                if (!apartment) {
                    return res.status(404).json({ error: 'Apartment not found' });
                }
                res.json(apartment);
            })
            .catch(err => res.status(400).json({ error: err.message }));
    }catch (e) {
        res.status(400).json({ error: e.message });
    }
}


exports.addApartment = async (req, res) => {
    try {
        // Check if name and PIN are provided
        const { name, PIN } = req.body;
        if (!name || !PIN) {
            return res.status(400).json({ error: "Name and PIN are required." });
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

        // Check if apartment name contains spaces
        if (name.includes(" ")) {
            return res.status(400).json({ error: "Apartment name cannot contain spaces." });
        }

        // Check if apartment name is already taken
        const existingApartment = await Apartment.findOne({ name });
        if (existingApartment) {
            return res.status(400).json({ error: "Apartment name already exists." });
        }

        // Create new apartment
        const newApartment = new Apartment({
            name,
            PIN
        });

        // Save apartment to database
        const savedApartment = await newApartment.save();

        // Update user's apartment_id
        user.apartment_id = savedApartment._id;
        await user.save();

        res.json({ apartment: savedApartment, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.editApartment=(req,res)=>{
    const apartmentId = req.params.apartmentId;

    try {
        Apartment.findByIdAndUpdate(apartmentId, req.body, { new: true })
            .then(updatedApartment => {
                if (!updatedApartment) {
                    return res.status(404).json({ error: 'Apartment not found' });
                }
                res.json(updatedApartment);
            })
            .catch(err => res.status(400).json({ error: err.message }));
    }catch (e) {
        res.status(400).json({ error: e.message });
    }
}

exports.deleteApartment=(req,res)=>{
    const apartmentId = req.params.apartmentId;

    try{
        Apartment.findOneAndDelete(apartmentId)
            .then(apartment => {
                if (!apartment) {
                    return res.status(404).json({ error: 'Apartment not found' });
                }
                res.json({ message: 'Apartment removed successfully' });
            })
            .catch(err => res.status(400).json({ error: err.message }));
    }catch (e) {
        res.status(400).json({ error: e.message });
    }
}












