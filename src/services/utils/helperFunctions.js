exports.getTokenFromRequest = (req) => {
    const authHeader = req.headers['authorization'];
    if(authHeader && authHeader.startsWith('Bearer ')){
        return authHeader.substring(7); // 'Bearer ' is 7 characters long
    }
    return null;
};
