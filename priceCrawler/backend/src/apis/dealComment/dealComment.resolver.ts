import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DealCommentService } from './dealComment.service';
import { CreateDealCommentInput } from './dto/createDealComment.input';
import { DealComment } from './entities/dealComment.entity';

@Resolver()
export class DealCommentResolver {
    constructor(private readonly dealCommentService: DealCommentService) {}

    @Query(() => [DealComment])
    fetchDealComments() {
        return this.dealCommentService.findAll();
    }

    @Query(() => DealComment)
    fetchDealComment(@Args('dealCommentId') dealCommentId: string) {
        return this.dealCommentService.findOne({ dealCommentId });
    }

    @Mutation(() => DealComment)
    createDealComment(
        @Args('createDealCommentInput')
        createDealCommentInput: CreateDealCommentInput,
    ) {
        return this.dealCommentService.create({ createDealCommentInput });
    }

    @Mutation(() => DealComment)
    async deleteDealComment(@Args('DealCommentId') dealCommentId: string) {
        return this.dealCommentService.delete({ dealCommentId });
    }
}
