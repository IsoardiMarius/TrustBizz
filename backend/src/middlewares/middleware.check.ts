import {MESSAGE_UNAUTHORIZED, MESSAGE_YOU_DONT_HAVE_REQUIRED_PERMISSIONS} from "../helpers/messages";
import {isAllowed} from "./access-control/access-control.middleware";
import {IContext, IMiddlewareCheckInputType} from "../interfaces/middleware.check.interface";

export enum MiddlewareType {
    ACL,
    AUTH
}

// Her we are checking if user is authenticated and if he has required permissions to access resolver
export const middlewareCheck = (data: IMiddlewareCheckInputType[],  context: IContext) => {
    data.forEach((item) => {
        /*
        In case you will in future implement more middlewares which should run on resolver level,
        add them in switch case and handle situation based on values obtained from context
        */

        // Check if user is authenticated and if he has required permissions to access resolver
        switch (item.type) {
            // If middleware type is ACL, check if user is authenticated and if he has required permissions to access resolver
            case MiddlewareType.ACL:
                if (!isAllowed(context.user, item.roles)) {
                    throw new Error(MESSAGE_YOU_DONT_HAVE_REQUIRED_PERMISSIONS);
                }
                break;
                // If middleware type is AUTH, check if user is authenticated
            case MiddlewareType.AUTH:
                if (!context.isAuthenticated) {
                    throw new Error(MESSAGE_UNAUTHORIZED);
                }
                break;

            default:
                break;
        }
    });
};
