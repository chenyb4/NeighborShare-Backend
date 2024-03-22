
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {StatusCodes} = require("http-status-codes");
const User = require("../database/models/User");



const logIn = async (email, password) => {
    const users = await User.find();

    const user = users.find((user) => {
        return user.email === email;
    });

    //if user found, check password. if not, status code unauthorized
    if (user) {
        const result = bcrypt.compareSync(password, user.passwordHash);
        if (result) {
            //user is authenticated, send a token
            return jwt.sign({
                name: user.name,
                email: user.email
            }, user.secret);
        }
    }
    return false;
};


exports.auth=(req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if(email && password) {

        logIn(email, password)
            .then(token => {
                if (token) {
                    return res.status(StatusCodes.ACCEPTED).send({token});
                } else {
                    return res.status(StatusCodes.UNAUTHORIZED).send('Credentials incorrect!');
                }
            })
            .catch(error => {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
            });

    } else {
        return res.status(StatusCodes.BAD_REQUEST).send('Error in email or password!');
    }
}
