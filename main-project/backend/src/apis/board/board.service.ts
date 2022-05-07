import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../category/entities/category.entity';
import { User } from '../user/entities/user.entity';
import { Board } from './entities/board.entity';

@Injectable()
export class BoardService {
    constructor(
        @InjectRepository(Board)
        private readonly boardRepository: Repository<Board>,

        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async findAll() {
        return await this.boardRepository.find({
            relations: ['category', 'user'],
        });
    }

    async findAllWithDelete() {
        return await this.boardRepository.find({
            withDeleted: true,
            relations: ['category', 'user'],
        });
    }

    async findOne({ boardId }) {
        const board = await this.boardRepository.findOne({ id: boardId });
        if (!board)
            throw new ConflictException(
                '검색하려는 게시글이 존재하지 않습니다',
            );

        return await this.boardRepository.findOne({
            where: { id: boardId },
            relations: ['category', 'user'],
        });
    }

    async create({ createBoardInput }) {
        const { categoryName, userId, ...board } = createBoardInput;

        const result1 = await this.categoryRepository.findOne({
            name: categoryName,
        });

        const result2 = await this.userRepository.findOne({
            id: userId,
        });

        const result3 = await this.boardRepository.save({
            ...board,
            categoryName: result1,
            userId: result2,
        });
        return result3;
    }

    async update({ boardId, updateBoardInput }) {
        const find = await this.boardRepository.findOne({ id: boardId });
        if (!find)
            throw new ConflictException(
                '수정하려는 게시글이 존재하지 않습니다',
            );

        const board = await this.boardRepository.findOne({
            where: { id: boardId },
        });
        const newBoard = { ...board, ...updateBoardInput };

        return await this.boardRepository.save(newBoard);
    }

    async delete({ boardId }) {
        const board = await this.boardRepository.findOne({ id: boardId });
        if (!board)
            throw new ConflictException(
                '삭제하려는 게시글이 존재하지 않습니다',
            );

        const result = await this.boardRepository.softDelete({
            id: boardId,
        });
        return result.affected ? true : false;
    }

    async restore({ boardId }) {
        const board = await this.boardRepository.findOne({ id: boardId });
        if (!board)
            throw new ConflictException(
                '복원하려는 게시글이 존재하지 않습니다',
            );

        const result = await this.boardRepository.restore({ id: boardId });
        return result;
    }
}
