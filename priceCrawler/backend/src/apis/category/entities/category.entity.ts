import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Category {
    @PrimaryGeneratedColumn('increment')
    @Field(() => Int)
    id: number;

    @Column()
    @Field(() => String)
    name: string;
}
