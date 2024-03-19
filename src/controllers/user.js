const User = require("../models/User");
const bcrypt = require("bcrypt");
const {v4: uuidv4} = require("uuid");


exports.getAllUsers=async (req,res)=>{
    try{
        const users=await User.find();
        res.json(users);
    }catch (err){
        res.json({message:err});
    }
}

exports.getUserById=async (req,res)=>{
    const userId = req.params.userId;


    try{
        // Find the user by their ID
        User.findById(userId)
            .then(user => {
                if (!user) {
                    return res.status(404).json({ error: 'User not found' });
                }
                res.json(user);
            })
            .catch(err => res.status(400).json({ error: err.message }));
    }catch (e) {
        res.status(400).json({ error: e.message });
    }
}

exports.addUser=async (req,res)=>{
    const salt=bcrypt.genSaltSync(10);

    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash:bcrypt.hashSync(req.body.password, salt),
        secret: uuidv4()
    });

    try{
        newUser.save()
            .then(user => res.json(user))
            .catch(err => res.status(400).json({ error: err.message }));
    }catch (e) {
        res.status(400).json({ error: e.message });
    }
}

exports.editUser=async (req,res)=>{
    const userId = req.params.userId;


    try{
        // Find the user by their ID and update their properties
        User.findByIdAndUpdate(userId, req.body, { new: true })
            .then(updatedUser => {
                if (!updatedUser) {
                    return res.status(404).json({ error: 'User not found' });
                }
                res.json(updatedUser);
            })
            .catch(err => res.status(400).json({ error: err.message }));
    }catch (e) {
        res.status(400).json({ error: e.message });
    }
}



exports.deleteUser=async (req,res)=>{
    const userId = req.params.userId;

    try{
        // Find the user by their ID and remove it
        User.findByIdAndDelete(userId)
            .then(user => {
                if (!user) {
                    return res.status(404).json({ error: 'User not found' });
                }
                res.json({ message: 'User removed successfully' });
            })
            .catch(err => res.status(400).json({ error: err.message }));
    }catch (e) {
        res.status(400).json({ error: e.message });
    }
}
