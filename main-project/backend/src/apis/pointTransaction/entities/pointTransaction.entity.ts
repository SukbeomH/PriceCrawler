import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User } from 'src/apis/user/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

// enum 타입 선언
export enum POINT_TRANSACTION_STATUS_ENUM {
    PAYMENT = 'PAYMENT',
    CANCEL = 'CANCEL',
}
// enum 을 gql에서 쓸수있게 등록
registerEnumType(POINT_TRANSACTION_STATUS_ENUM, {
    name: 'POINT_TRANSACTION_STATUS_ENUM',
});

@Entity()
@ObjectType()
export class PointTransaction {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id: string;

    @Column()
    @Field(() => String)
    impUid: string;

    @Column()
    @Field(() => Int)
    amount: number;

    // paid canceled ... enum형식으로 지정
    @Column({ type: 'enum', enum: POINT_TRANSACTION_STATUS_ENUM })
    @Field(() => POINT_TRANSACTION_STATUS_ENUM)
    status: string;

    @ManyToOne(() => User)
    @Field(() => User)
    user: User;

    @CreateDateColumn()
    @Field(() => Date)
    purchasedAt: Date;
}
