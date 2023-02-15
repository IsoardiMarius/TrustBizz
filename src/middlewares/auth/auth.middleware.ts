import * as  express from 'express';
import {generateNewAccessToken, verifyToken} from "../../services/middleware.token";

require('dotenv').config();


export const AuthMiddleware = async (request, response, next: express.NextFunction): Promise<void | Error>  => {

    request.isAuthenticated = false;

    try {

        const authorizationHeader = request.headers.authorization;

        if (!authorizationHeader) {
            return next();
        }

        const accessToken = authorizationHeader.replace('Bearer ', '');

        const decodedAccessToken = await verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET);

        const payloadUserData = {
            email: decodedAccessToken?.email,
            id: decodedAccessToken?.id,
            roles: decodedAccessToken?.roles,
            ip: request?.ip,
        };

        if (request.ip != decodedAccessToken.ip) {
            console.log(typeof request.ip, typeof decodedAccessToken.ip)
            console.log(request.ip != decodedAccessToken.ip)
            console.log('requestIP: ', request.ip, 'payloadUserDataIP: ' , decodedAccessToken?.ip + " BEFOREEEEEEE")
            return next();
        }
        console.log('requestIP: ', request.ip, 'payloadUserDataIP: ' , payloadUserData?.ip + " AFTEEEER")
        Object.assign(request, { payloadUserData, isAuthenticated: true });
        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {

            const refreshToken = request.headers.refreshtoken;

            if (refreshToken) {
                try {
                    const decodedRefreshToken = await verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                    console.log('requestIP: ', request.ip, 'refreshTokenIP: ' , decodedRefreshToken)


                    if (Date.now() >= decodedRefreshToken.exp * 1000) {
                         new Error('Refresh token expired');
                    }

                    if (request.ip !== decodedRefreshToken.ip) {
                        console.log('requestIP: ', request.ip, 'refreshTokenIP: ' , decodedRefreshToken?.ip + " BEFOR")
                        return next();
                    }

                    const user = {
                        email: decodedRefreshToken?.email,
                        id: decodedRefreshToken?.id,
                        roles: decodedRefreshToken?.roles,
                        ip: request?.ip,
                    };

                    const accessToken = generateNewAccessToken(user);

                    console.log('authentfication successfull');
                    Object.assign(request, { user, isAuthenticated: true });

                    response.setHeader('refreshtoken', refreshToken);
                    response.setHeader('Authorization', `Bearer ${accessToken}`);

                    next();

                } catch (error) {
                    if (error.name === 'TokenExpiredError') {
                        throw new Error('Refresh token expired too');
                    }

                    return next(error);
                }
            } else {
                return next();
            }
        } else {
            return next(error);
        }
    }
};


export default AuthMiddleware;
