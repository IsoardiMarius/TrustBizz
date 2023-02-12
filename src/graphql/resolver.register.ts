import authResolver from "./unauthorized/auth/auth.resolver";
import bookResolver from "./authorized/book/book.resolver";
import registerResolver from "./unauthorized/register/register.resolver";

export const RESOLVERS = {
    authorized: [
        bookResolver
    ],
    unauthorized: [
        authResolver,
        registerResolver
    ]
};
