const jwt = require('jsonwebtoken');
require('dotenv').config();

export const generateAccessToken = (user) => {
  return  jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1m'})
}

export const generateRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '1y'});
}

export const generateNewAccessToken = (user) => {
    return jwt.sign({ user, iat: Date.now() / 1000 },
        process.env.ACCESS_TOKEN_SECRET,
        { algorithm: 'HS256', noTimestamp: true, expiresIn: '30s' });
}

export const verifyToken = (token, secret) => {
    return jwt.verify(token, secret);
}