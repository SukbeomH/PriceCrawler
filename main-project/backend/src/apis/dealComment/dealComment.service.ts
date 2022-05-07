import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deal } from '../deal/entities/deal.entity';
import { User } from '../user/entities/user.entity';
import { DealComment } from './entities/dealComment.entity';

@Injectable()
export class DealCommentService {
    constructor(
        @InjectRepository(DealComment)
        private readonly dealCommentRepository: Repository<DealComment>,

        @InjectRepository(Deal)
        private readonly dealRepository: Repository<Deal>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async findAll() {
        return await this.dealCommentRepository.find({
            relations: ['deal', 'user'],
        });
    }

    async findOne({ dealCommentId }) {
        const comment = await this.dealCommentRepository.findOne({
            id: dealCommentId,
        });
        if (!comment)
            throw new ConflictException('검색하려는 댓글이 존재하지 않습니다');

        return await this.dealCommentRepository.findOne({
            where: { id: dealCommentId },
            relations: ['deal', 'user'],
        });
    }

    async create({ createDealCommentInput }) {
        const { dealId, userId, ...comment } = createDealCommentInput;

        const result1 = await this.dealRepository.findOne({
            id: dealId,
        });

        const result2 = await this.userRepository.findOne({
            id: userId,
        });
        const result3 = await this.dealCommentRepository.save({
            ...comment,
            dealId: result1,
            userId: result2,
        });
        return result3;
    }

    async delete({ dealCommentId }) {
        const comment = await this.dealCommentRepository.findOne({
            id: dealCommentId,
        });
        if (!comment)
            throw new ConflictException('삭제하려는 댓글이 존재하지 않습니다');

        const result = await this.dealCommentRepository.delete({
            id: dealCommentId,
        });
        return result.affected ? true : false;
    }
}
