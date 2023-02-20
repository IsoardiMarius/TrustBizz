const jwt = require('jsonwebtoken');
require('dotenv').config();

export const verifyToken = (token, secret) => {
    return jwt.verify(token, secret);
}
export const generateAccessToken = (user) => {
  return  jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1m'})
}

export const generateRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '1y'});
}

export const generateNewAccessToken = (user) => {
    return jwt.sign( user, process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: '1m' });
}

export const generateNewRefreshToken = (user) => {
    return jwt.sign( user, process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: '1y' });
}

