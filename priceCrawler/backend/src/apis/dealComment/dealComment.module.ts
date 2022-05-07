import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deal } from '../deal/entities/deal.entity';
import { User } from '../user/entities/user.entity';
import { DealCommentResolver } from './dealComment.resolver';
import { DealCommentService } from './dealComment.service';
import { DealComment } from './entities/dealComment.entity';

@Module({
    imports: [TypeOrmModule.forFeature([DealComment, Deal, User])],
    providers: [DealCommentResolver, DealCommentService],
})
export class DealCommentModule {}
