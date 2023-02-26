import RegisterMutationService from "./register.mutation.service";

const registerQueryService = new RegisterMutationService();

const registerResolver = {
    Mutation: {
        register(parent, {input: {email, password}}, ctx) {
            return registerQueryService.register(email, password, ctx.request.ip)
        },
    }
};

export default registerResolver;
