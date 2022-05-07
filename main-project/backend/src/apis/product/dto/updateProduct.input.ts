import { InputType, PartialType } from '@nestjs/graphql';
import { CreateProductInput } from './createProduct.input';

@InputType()
export class UpdateProductInput extends PartialType(CreateProductInput) {}

// OmitType: 빼고 가져올것 고르기
// PickType: 골라서 가져올것 고르기
