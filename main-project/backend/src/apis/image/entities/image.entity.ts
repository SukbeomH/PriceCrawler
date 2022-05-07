import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from 'typeorm';
import { Product } from 'src/apis/product/entities/product.entity';
import { ObjectType, Field } from '@nestjs/graphql';
import { Board } from 'src/apis/board/entities/board.entity';

@Entity()
@ObjectType()
export class Image {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id: string;

    @Column()
    @Field(() => [String])
    image: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt?: Date;

    @ManyToOne(() => Product, { onDelete: 'CASCADE' })
    @Field(() => Product)
    product: Product;

    @ManyToOne(() => Board, { onDelete: 'CASCADE' })
    @Field(() => Board)
    board: Board;
}
