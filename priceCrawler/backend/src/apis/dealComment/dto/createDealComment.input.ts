import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateDealCommentInput {
    @Field(() => String)
    content: string;

    @Field(() => String)
    dealId: string;

    @Field(() => String)
    userId: string;
}
