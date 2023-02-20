import * as  express from 'express';
import {verifyToken} from "../../services/service.token";

require('dotenv').config();



export const AuthMiddleware = async (request, response, next: express.NextFunction): Promise<void | Error>  => {

    // Init isAuthenticated to false
    request.isAuthenticated = false;

    try {
        // Get the authorization header
        const authorizationHeader = request.headers.authorization;

        // If there is no authorization header, return next() whit isAuthenticated = false
        if (!authorizationHeader) {
            return next();
        }

        // If there is an authorization header, get the access token
        const accessToken = authorizationHeader.replace('Bearer ', '');
        // Verify the access token
        const decodedAccessToken = await verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET);

        // Get the user data from the access token
        const user = {
            email: decodedAccessToken?.email,
            id: decodedAccessToken?.id,
            roles: decodedAccessToken?.roles,
            ip: request?.ip,
        };

        if(!decodedAccessToken) {
            return next()
        }

        // If the ip address from the request is not the same
        // as the ip address from the access token, return next() whit isAuthenticated = false
        if (request.ip != user.ip) {
            return next();
        }

        // Else, set isAuthenticated to true for the request
        Object.assign(request, { user, isAuthenticated: true });
        next();

        // If the access token is expired, try to get the refresh token
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            console.log('TokenExpiredError')

           const test = verifyToken(request.headers.refreshtoken, process.env.REFRESH_TOKEN_SECRET)
            //
            // if(test) {
            //     const user = {
            //         email: test?.email,
            //         id: test?.id,
            //         roles: test?.roles,
            //         ip: request?.ip,
            //     };
            //
            //     Object.assign(request, { user, isAuthenticated: true });
            //     next()
            // }
            // else
            return response.status(401).json({message: 'Unauthorizedd'});
        }
            }
}


export default AuthMiddleware;
