import {generateNewAccessToken, generateNewRefreshToken, verifyToken} from "./service.token";

const express = require('express');
const router = express.Router();

router.post('/',(req, res) => {
    const refreshToken = req.body?.refresh_token;
    if (!refreshToken) {
        throw new Error('Refresh token not found');
    }

    try {
        const decodedRefreshToken = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        if (!decodedRefreshToken) {
            new Error('Refresh token not valid');
        }

        if (Date.now() >= decodedRefreshToken.exp * 1000) {
            new Error('Refresh token expired');
        }

        else {
            console.log("decodedRefreshToken", decodedRefreshToken)
            try {

                const newPayloadToken = {
                    email: decodedRefreshToken?.email,
                    id: decodedRefreshToken?.id,
                    roles: decodedRefreshToken?.roles,
                    ip: req?.ip,
                };

                const newAccessToken = generateNewAccessToken(newPayloadToken);
                const newRefreshToken = generateNewRefreshToken(newPayloadToken);


                res.cookie('accessToken', newAccessToken, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 30,
                });

                res.cookie('refreshToken', newRefreshToken, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24 * 365,
                });

                res.status(200).json({
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                });
            }
            catch (e) {
                console.log("e", e)
                new Error(e);
            }
        }

    }
    catch (e) {
        throw new Error(e.message);
    }
});

module.exports = router;