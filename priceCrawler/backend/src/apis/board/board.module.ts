import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { BoardResolver } from './board.resolver';
import { BoardService } from './board.service';
import { Category } from '../category/entities/category.entity';
import { User } from '../user/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Board, Category, User])],
    providers: [BoardResolver, BoardService],
})
export class BoardModule {}
