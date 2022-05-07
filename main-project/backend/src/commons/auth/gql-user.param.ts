import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export interface IContextUser {
    id: string;
    email: string;
}

export const ContextUser = createParamDecorator(
    (data: any, context: ExecutionContext): IContextUser => {
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req.user;
    },
);
