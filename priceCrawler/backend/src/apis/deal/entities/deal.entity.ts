import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Category } from 'src/apis/category/entities/category.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Deal {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id: string;

    @Column()
    @Field(() => String)
    name: string;

    @Column()
    @Field(() => Int)
    price: number;

    @Column()
    @Field(() => String)
    site: string;

    @Column()
    @Field(() => String)
    shop: string;

    @Column()
    @Field(() => Boolean)
    isEnd: boolean;

    @Column()
    @Field(() => String)
    time: string;

    @Column()
    @Field(() => String)
    image: string;

    @ManyToOne(() => Category, { onDelete: 'CASCADE' })
    @Field(() => Category)
    category: Category;
}
