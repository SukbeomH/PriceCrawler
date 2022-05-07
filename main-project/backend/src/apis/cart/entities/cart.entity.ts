import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToMany,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Product } from 'src/apis/product/entities/product.entity';
import { Int, ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/apis/user/entities/user.entity';

@Entity()
@ObjectType()
export class Cart {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id: string;

    @Column()
    @Field(() => Int)
    price: number;

    @Column()
    @Field(() => Int)
    count: number;

    @Column({ default: 1 })
    @Field(() => Boolean, { defaultValue: 1 })
    able: boolean;

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateAt: Date;

    @ManyToMany(() => Product, (product) => product.carts)
    @Field(() => [Product])
    products: Product[];

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @Field(() => User)
    user: User;
}
