import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    ManyToMany,
    JoinTable,
    DeleteDateColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/apis/user/entities/user.entity';
import { Cart } from 'src/apis/cart/entities/cart.entity';
import { Int, ObjectType, Field } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id: string;

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    name: string;

    @Column({ nullable: true })
    @Field(() => Int, { nullable: true })
    price: number;

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    descriptions: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt?: Date;

    @DeleteDateColumn()
    deletedAt?: Date;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @Field(() => User)
    user: User;

    @JoinTable()
    @ManyToMany(() => Cart, (cart) => cart.products)
    @Field(() => [Cart])
    carts: Cart[];
}
