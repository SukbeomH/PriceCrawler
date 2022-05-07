import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) {}

    async findAll() {
        return await this.categoryRepository.find();
    }

    async findAllWithDelete() {
        return await this.categoryRepository.find({ withDeleted: true });
    }

    async findOne({ name }) {
        const category = await this.categoryRepository.findOne({
            name,
        });
        if (!category)
            throw new ConflictException(
                '검색하려는 카테고리가 존재하지 않습니다',
            );

        return await this.categoryRepository.findOne({
            where: { name },
        });
    }

    async create({ name }) {
        const category = await this.categoryRepository.findOne({ name });
        if (category)
            throw new ConflictException('이미 존재하는 카테고리명 입니다');
        return await this.categoryRepository.save({ name });
    }
}
