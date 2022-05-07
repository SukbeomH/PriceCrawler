import { ObjectType, Field } from '@nestjs/graphql';
import { Deal } from 'src/apis/deal/entities/deal.entity';
import { User } from 'src/apis/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn, } from 'typeorm';

@Entity()
@ObjectType()
export class DealComment {
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

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @Field(() => User)
    user: User;

    @ManyToOne(() => Deal, { onDelete: 'CASCADE' })
    @Field(() => Deal)
    deal: Deal;
}
