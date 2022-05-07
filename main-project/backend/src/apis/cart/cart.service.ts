import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Cart } from './entities/cart.entity';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private readonly cartRepository: Repository<Cart>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async findAll() {
        const result = await this.cartRepository.find({
            relations: ['user', 'product'],
        });
        return result;
    }

    async findOne({ cartId }) {
        const cart = await this.cartRepository.findOne({ id: cartId });
        if (!cart)
            throw new ConflictException(
                '검색하려는 장바구니가 존재하지 않습니다',
            );
        const result = await this.cartRepository.findOne({
            where: { id: cartId },
            relations: ['user', 'product'],
        });
        return result;
    }

    async create({ createCartInput }) {
        const { userId, ...cart } = createCartInput;

        const result1 = await this.userRepository.findOne({
            id: userId,
        });
        const result2 = await this.cartRepository.save({
            ...cart,
            userId: result1,
        });
        return result2;
    }

    async update({ cartId, updateCartInput }) {
        const cart = await this.cartRepository.findOne({ id: cartId });
        if (!cart)
            throw new ConflictException(
                '수정하려는 장바구니가 존재하지 않습니다',
            );
        const cart1 = await this.cartRepository.findOne({
            where: { id: cartId },
        });
        const newCart = { ...cart1, ...updateCartInput };
        const result = await this.cartRepository.save(newCart);
        return result;
    }

    // 계정에 귀속으로 계정 삭제 시 영구적으로 삭제
    async delete({ cartId }) {
        const cart = await this.cartRepository.findOne({ id: cartId });
        if (!cart)
            throw new ConflictException(
                '삭제하려는 장바구니가 존재하지 않습니다',
            );
        const result = await this.cartRepository.delete({
            id: cartId,
        });
        return result.affected ? true : false;
    }
}
