import { ObjectType, Field } from '@nestjs/graphql';
import { Board } from 'src/apis/board/entities/board.entity';
import { User } from 'src/apis/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn, } from 'typeorm';

@Entity()
@ObjectType()
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id: string;

    @Column()
    @Field(() => String)
    content: string;

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateAt: Date;

    @ManyToOne(() => Board, { onDelete: 'CASCADE' })
    @Field(() => Board)
    board: Board;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @Field(() => User)
    user: User;
}
