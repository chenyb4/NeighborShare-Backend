const User = require("../database/models/User");
const bcrypt = require("bcrypt");
const {v4: uuidv4} = require("uuid");
const {startSession} = require("mongoose");

const logger=require("../utils/logger")


exports.getAllUsers = async (req, res) => {
    logger.error("another sample error");
    try {
        let query = {};

        // Check if email query parameter is provided
        if (req.query.email) {
            query.email = req.query.email;
        }

        const users = await User.find(query);
        res.json(users);
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ message: err.message });
    }
};


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
        logger.error(e.message);
        res.status(400).json({ error: e.message });
    }
}

exports.addUser = async (req, res) => {
    const { name, email, password } = req.body;
    const session = await startSession();

    try {
        await session.withTransaction(async () => {
            // Check if the email already exists
            const existingUser = await User.findOne({ email }).session(session);

            if (existingUser) {
                return res.status(400).json({ error: "Email already exists." });
            }

            // If the email doesn't exist, proceed to create a new user
            const salt = bcrypt.genSaltSync(10);

            const newUser = new User({
                name,
                email,
                passwordHash: bcrypt.hashSync(password, salt),
                secret: uuidv4()
            });

            // Save the new user to the database
            await newUser.save({ session });

            res.status(201).json(newUser);
        });
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ error: error.message });
    } finally {
        session.endSession();
    }
};


exports.editUser = async (req, res) => {
    const userId = req.params.userId;
    const session = await startSession();

    try {
        await session.withTransaction(async () => {
            // Find the user by their ID and update their properties
            const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true }).session(session);

            if (!updatedUser) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json(updatedUser);
        });
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ error: error.message });
    } finally {
        session.endSession();
    }
};



exports.deleteUser = async (req, res) => {
    const userId = req.params.userId;
    const session = await startSession();

    try {
        await session.withTransaction(async () => {
            // Find the user by their ID and remove it
            const user = await User.findByIdAndDelete(userId).session(session);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json({ message: 'User removed successfully' });
        });
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ error: error.message });
    } finally {
        session.endSession();
    }
};
