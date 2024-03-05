const express=require('express');
const router=express.Router();
const Apartment=require('../models/Apartment');

//get all
router.get('',async (req,res)=>{
   try{
       const apartments=await Apartment.find();
       res.json(apartments);
   }catch (e){
       res.status(400).json({ error: e.message });
   }
});


//get one by id
router.get('/:apartmentId', (req, res) => {
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

});


//create
router.post('', (req, res) => {
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

});



//update
router.put('/:apartmentId', (req, res) => {
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

});


//delete
router.delete('/:apartmentId', (req, res) => {
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

});


module.exports=router;
