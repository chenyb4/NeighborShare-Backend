const Apartment = require("../database/models/Apartment");


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


exports.addApartment=async (req,res)=>{
    const newApartment = new Apartment({
        name: req.body.name
    });

    try {
        newApartment.save()
            .then(apartment => res.json(apartment))
            .catch(err => res.status(400).json({ error: err.message }));
    }catch (e) {
        res.status(400).json({ error: e.message });
    }
}


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












