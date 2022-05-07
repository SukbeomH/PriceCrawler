import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';

@Injectable()
export class ImageService {
    constructor(
        @InjectRepository(Image)
        private readonly imageRepository: Repository<Image>,
    ) {}

    // 상품데이터 생성
    async create({ productId, images }) {
        try {
            let results;
            await images.forEach(async (element: string) => {
                // 상품데이터 생성
                const image = this.imageRepository.create({
                    product: productId,
                    image: element,
                });
                results = await this.imageRepository.save(image);
            });
            // 결과를 프론트에 반환
            return await this.imageRepository.find({ id: results.id });
        } catch (error) {
            console.log(error);
        }
    }

    // 상품 데이터 업데이트
    async update({ productId, images }) {
        try {
            // 기존 상품데이터 삭제
            await this.imageRepository.delete({
                product: productId,
            });
            // 덮어쓰기
            const results = [];
            await images.forEach(async (element: string) => {
                // 상품데이터 생성
                const image = this.imageRepository.create({
                    product: productId,
                    image: element,
                });
                await this.imageRepository.save(image);
            });
            return results;
        } catch (error) {
            console.log(error);
        }
    }
}
