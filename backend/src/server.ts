import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import AuthMiddleware from "./middlewares/auth/auth.middleware";
import {generateMiddlewareGraphql} from "./middlewares/graphql-express/graphql-express.middleware";
import {generateNewAccessToken, generateNewRefreshToken, verifyToken} from "./services/service.token";

const cookieParser = require('cookie-parser');

require('dotenv').config();


(async () => {
    const PORT = 4444;
    const API_PATH = '/graphql';

    const app = express();
    const graphqlMiddleware = await generateMiddlewareGraphql();

    // cors is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
    app.use(cors());
    // body-parser is a node.js body parsing middleware. It is responsible for parsing the incoming request bodies in a middleware before you handle it.
    // limit is the maximum request body size. If this is a number, then the value specifies the number of bytes; if it is a string, the value is passed to the bytes library for parsing.
    app.use(bodyParser.json({limit: '501mb'}));
    app.use(cookieParser());

    app.post(API_PATH + '/refreshtoken', (req, res) => {
        const refreshToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRkZGRlampka2VkIiwiaWQiOjM0Nywicm9sZXMiOlsidmlldyIsImRlbGV0ZSJdLCJpcCI6Ijo6ZmZmZjoxMjcuMC4wLjEiLCJpYXQiOjE2NzY4NjIwNTIsImV4cCI6MTcwODQxOTY1Mn0.l1L6PPVSS5W20bC-AiYY0ANSOMjSBbnNTfShyQFcA4o"

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
                    }
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

    // Here we define the graphql endpoint and the middlewares that will be used
    app.post(API_PATH,
        [
            AuthMiddleware,
            graphqlMiddleware
        ],
    );


    app.listen(PORT, () => {
        console.log(`Graphql server started on http://localhost:${PORT}${API_PATH}`);
    });

})();
