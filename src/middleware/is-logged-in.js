const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcrypt');
const { verify } = require("jsonwebtoken");
const jwt = require('jsonwebtoken');
const User = require("../models/User");




const isLoggedIn = (req, res, next) => {
    console.log('Authenticating...');
    if (checkHeaderFormat(req)) {
        const token = getTokenFromRequest(req);

        if (token) {
            verifyToken(token)
                .then(payload => {
                    if (payload) {
                        req.user = payload;
                        return next();
                    } else {
                        res.status(StatusCodes.UNAUTHORIZED).send('Something wrong with your credentials.');
                    }
                })
                .catch(error => {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Internal Server Error');
                });
        } else {
            res.status(StatusCodes.UNAUTHORIZED).send('No token provided.');
        }
    } else {
        res.status(StatusCodes.BAD_REQUEST).send('The format of the authorization header is incorrect. Correct format should be "Bearer⌴token".')
    }
};


const checkHeaderFormat=(req)=>{
    const authHeader = req.headers['authorization'];
    if(authHeader){
        if (!authHeader.includes(' ')){
            return false;
        }else if(!authHeader.split(' ')[0]=="Bearer"){
            return false;
        }
    }else{
        return false;
    }

    return true;
};

const getTokenFromRequest = (req) => {
    const authHeader = req.headers['authorization'];
    if(authHeader){
        return authHeader.split(' ')[1];
    }
    return false;
};

const verifyToken = async (token) => {
    try {
        let users = await User.find();
        const tokenPayload = jwt.decode(token);
        console.log('Token payload', tokenPayload);
        if (tokenPayload) {
            const user = users.find(user => user.email === tokenPayload.email);
            return jwt.verify(token, user.secret);
        }
    } catch (e) {
        return false;
    }
};

module.exports=isLoggedIn;
