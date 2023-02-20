import {USER_ROLES} from "../../../helpers/fake-db.helper";
import {generateAccessToken, generateRefreshToken} from '../../../services/service.token';

const db = require('../../../database');
require('dotenv').config();


type UserDataResponse = {
    id: number,
    email: string,
    accessToken: string,
    refreshToken: string,

}
export default class RegisterMutationService {

    register(email: string, password: string): UserDataResponse | Error {

        const query = `INSERT INTO users (email, password) VALUES ('${email}', '${password}') RETURNING *`;

        return db.query(query)
            .then(async res => {
                const user = res.rows[0];
                const accessToken =  generateAccessToken({
                    email: user.email,
                    id: user.id,
                    roles: [USER_ROLES.View, USER_ROLES.Delete],
                    ip: "::ffff:127.0.0.1"
                });
                const refreshToken = generateRefreshToken(
                    {
                        email: user.email,
                        id: user.id,
                        roles: [USER_ROLES.View, USER_ROLES.Delete],
                        ip:  "::ffff:127.0.0.1"
                    }
                );

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
