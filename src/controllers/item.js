const Item = require("../models/Item");


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

exports.addItem=async (req,res)=>{
    const {name, ownerEmail, description,apartmentNumber,isAvailable} = req.body;


    const newItem = new Item({
        name: name,
        ownerEmail: ownerEmail,
        description: description,
        apartmentNumber:apartmentNumber,
        isAvailable:isAvailable,
    });

    try{
        newItem.save()
            .then(item => res.json(item))
            .catch(err => res.status(400).json({ error: err.message }));
    }catch (e) {
        res.status(400).json({ error: e.message });
    }
}


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

    try{
        Item.findOneAndDelete(itemId)
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
