import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import AuthMiddleware from "./middlewares/auth/auth.middleware";
import {generateMiddlewareGraphql} from "./middlewares/graphql-express/graphql-express.middleware";

const refreshTokenRoute = require('./token/refresh_token');
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

    app.use(API_PATH + '/refreshtoken', refreshTokenRoute);

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
