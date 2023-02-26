import {graphqlExpress} from "apollo-server-express/dist/expressApollo";
import {Request} from "express";
import {generateSchema} from "../../graphql/schema.generator";
import {IContext} from "../../interfaces/middleware.check.interface";

export const generateMiddlewareGraphql = () => {
    return graphqlExpress(
        async (request: Request & IContext) => {
            // Here we are generating schema based on user permissions (if user is authenticated)
            const schema = generateSchema(request.isAuthenticated);

            // Here we are creating context which will be passed to resolvers and will be used for authorization
            const context = {
                isAuthenticated: false,
                request
            };

            // If user is authenticated attach additional info to context which will be passed to resolvers and will be used for authorization
            if (request.isAuthenticated) {
                Object.assign(context, {
                    isAuthenticated: true,
                    user: request.user
                })
            }
            // Else if user is not authenticated, attach additional info to context which will be passed to resolvers and will be used for authorization
            return Object.assign({
                schema,
                context,
                formatError: (error) => error.message
            });

        })
};
