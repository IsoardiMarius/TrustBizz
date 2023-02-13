import * as  express from 'express';
import { ACCESS_TOKENS, users } from "../../helpers/fake-db.helper";
import { IUser } from "../../interfaces/fake-db.interface";
const jwt = require('jsonwebtoken');
require('dotenv').config();

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

        if (decodedToken.exp < Date.now() / 1000) {
            return next();
        }
        console.log(user + ' ' + decodedToken.exp);

        if (request?.ip !== user?.ip) return next();

        Object.assign(request, { user, isAuthenticated: true }); // Ajoutez les informations de l'utilisateur à la demande
        next();

    } catch (error) {
        return next();
    }
};

export default AuthMiddleware;
