import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { CreateCommentInput } from './dto/createComment.input';
import { Comment } from './entities/comment.entity';

@Resolver()
export class CommentResolver {
    constructor(private readonly commentService: CommentService) {}

    @Query(() => [Comment])
    fetchComments() {
        return this.commentService.findAll();
    }

    @Query(() => Comment)
    fetchComment(@Args('commentId') commentId: string) {
        return this.commentService.findOne({ commentId });
    }

    @Mutation(() => Comment)
    createComment(
        @Args('createCommentInput')
        createCommentInput: CreateCommentInput,
    ) {
        return this.commentService.create({ createCommentInput });
    }

    @Mutation(() => Comment)
    async deleteComment(@Args('CommentId') commentId: string) {
        return this.commentService.delete({ commentId });
    }
}
