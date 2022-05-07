import { Field, InputType, Int } from '@nestjs/graphql';
import { CreateImageInput } from 'src/apis/image/dto/createImage.input';

@InputType()
export class CreateProductInput {
    @Field(() => String, { nullable: true })
    name: string;

    @Field(() => Int, { nullable: true })
    price: number;

    @Field(() => String, { nullable: true })
    descriptions: string;

    @Field(() => String)
    userId: string;

    // @Field(() => [String])
    // cart: string[];

    // @Field(() => CreateImageInput)
    // image: CreateImageInput;
}
