import { InputType, PartialType } from '@nestjs/graphql';
import { CreateBoardInput } from './createBoard.input';

@InputType()
export class UpdateBoardInput extends PartialType(CreateBoardInput) {}

// OmitType: 빼고 가져올것 고르기
// PickType: 골라서 가져올것 고르기
