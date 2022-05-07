import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateCartInput {
    @Field(() => Int)
    price: number;

    @Field(() => Int)
    count: number;

    @Field(() => Boolean, { defaultValue: 1 })
    able: boolean;
}
