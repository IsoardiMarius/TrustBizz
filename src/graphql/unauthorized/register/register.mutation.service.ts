const db = require('../../../database');
import {generateAccessToken, generateRefreshToken} from '../../../middlewares/middleware.token';
require('dotenv').config();



export default class RegisterMutationService {
    register(email: string, password: string): any {
        return db.query( `INSERT INTO users (email, password) VALUES ('${email}', '${password}') RETURNING *`)
            .then(async res => {
                const user = res.rows[0];
                const accessToken =  generateAccessToken(user);
                const refreshToken = generateRefreshToken(user);

                return {
                    ...user,
                   accessToken,
                    refreshToken,
                };
            })
            .catch(err => {
                if(err.code === '23505') {
                    const message = err.message || 'Email already exists';
                    const status = err.status || 400;
                    throw new Error(`[${status}] ${message}`);
                }
                throw new Error(`[${err}]`);
            });
    }
}
