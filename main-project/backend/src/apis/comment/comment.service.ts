import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from '../board/entities/board.entity';
import { User } from '../user/entities/user.entity';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,

        @InjectRepository(Board)
        private readonly boardRepository: Repository<Board>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async findAll() {
        return await this.commentRepository.find({
            relations: ['board', 'user'],
        });
    }

    async findOne({ commentId }) {
        const comment = await this.commentRepository.findOne({
            id: commentId,
        });
        if (!comment)
            throw new ConflictException('검색하려는 댓글이 존재하지 않습니다');

        return await this.commentRepository.findOne({
            where: { id: commentId },
            relations: ['board', 'user'],
        });
    }

    async create({ createCommentInput }) {
        const { boardId, userId, ...comment } = createCommentInput;

        const result1 = await this.boardRepository.findOne({
            id: boardId,
        });

        const result2 = await this.userRepository.findOne({
            id: userId,
        });
        const result3 = await this.commentRepository.save({
            ...comment,
            boardId: result1,
            userId: result2,
        });
        return result3;
    }

    async delete({ commentId }) {
        const comment = await this.commentRepository.findOne({
            id: commentId,
        });
        if (!comment)
            throw new ConflictException('삭제하려는 댓글이 존재하지 않습니다');

        const result = await this.commentRepository.delete({
            id: commentId,
        });
        return result.affected ? true : false;
    }
}
