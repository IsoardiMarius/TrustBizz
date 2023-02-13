import * as  express from 'express';
import { ACCESS_TOKENS, users } from "../../helpers/fake-db.helper";
import { IUser } from "../../interfaces/fake-db.interface";
const jwt = require('jsonwebtoken');
require('dotenv').config();
import { generateAccessToken} from "../middleware.token";


export const AuthMiddleware = (request, response, next: express.NextFunction) => {

    request.isAuthenticated = false;

    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader) return next();

    const token: string = authorizationHeader.replace('Bearer ', ''); // Supprimez le préfixe 'Bearer ' du token

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) // Vérifiez le token en utilisant la clé secrète JWT
        const user = {
            email: decodedToken?.email,
            id: decodedToken?.id,
            roles: decodedToken?.roles,
            ip: request?.ip
        }
        console.log('token toujours valable')


        if (request?.ip !== user?.ip) return next();

        Object.assign(request, { user, isAuthenticated: true }); // Ajoutez les informations de l'utilisateur à la demande
        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            console.log('teeeeest')

            const refreshToken = request.headers.refreshtoken // récupérer le refresh token depuis les cookies
            if (refreshToken) {
                try {
                    console.log('tokenexpirederror')
                    const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET) // Vérifiez le token de rafraîchissement en utilisant la clé secrète JWT
                    // Vérifier si le refresh token est expiré
                    if (Date.now() >= decodedRefreshToken.exp * 1000) {
                        new Error('Refresh token expired');
                    }

                    const user = {
                        email: decodedRefreshToken?.email,
                        id: decodedRefreshToken?.id,
                        roles: decodedRefreshToken?.roles,
                        ip: request?.ip
                    }
                    const accessToken = jwt.sign({ user, iat: Date.now() / 1000 }, process.env.ACCESS_TOKEN_SECRET, { algorithm: 'HS256', noTimestamp: true, expiresIn: '20s' }); // Générer un nouveau token d'accès
                    Object.assign(request, { user, isAuthenticated: true }); // Ajoutez les informations de l'utilisateur à la demande
                    next();

                    // Générer un nouveau token d'accès à l'aide du token de rafraîchissement
                    response.setHeader('refreshtoken', refreshToken); // Envoyer le nouveau token de rafraîchissement dans l'en-tête de réponse
                    response.setHeader('Authorization', `Bearer ${accessToken}`); // Envoyer le nouveau token d'accès dans l'en-tête de réponse


                } catch (error) {
                    console.log(error)
                    return next();
                }
            } else {
                return next();
            }
        } else {
            return next();
        }
    }
};

export default AuthMiddleware;
