import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateImageInput {
    @Field(() => [String])
    image: string[];
}
