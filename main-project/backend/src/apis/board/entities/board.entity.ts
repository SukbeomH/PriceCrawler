import { Column, Entity, PrimaryGeneratedColumn, ManyToOne,
    CreateDateColumn,
    UpdateDateColumn, } from 'typeorm';
import { User } from 'src/apis/user/entities/user.entity';
import { Category } from 'src/apis/category/entities/category.entity';
import { ObjectType, Field } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Board {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id: string;

    @Column()
    @Field(() => String, { nullable: true })
    title: string;

    @Column()
    @Field(() => String, { nullable: true })
    content: string;

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateAt: Date;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @Field(() => User)
    user: User;

    @ManyToOne(() => Category, { onDelete: 'CASCADE' })
    @Field(() => Category)
    category: Category;
}
