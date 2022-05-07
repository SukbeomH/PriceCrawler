import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import {
    PointTransaction,
    POINT_TRANSACTION_STATUS_ENUM,
} from './entities/pointTransaction.entity';

@Injectable()
export class PointTransactionService {
    constructor(
        @InjectRepository(PointTransaction)
        private readonly pointTransactionRepository: Repository<PointTransaction>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly connection: Connection,
    ) {}

    async checkDuplicate({ impUid }) {
        // 거래기록이 이미 존재하는지 확인
        const order = await this.pointTransactionRepository.findOne({ impUid });
        if (order) throw new ConflictException('이미 존재하는 결제 건입니다 🫢');
    }

    async create({
        impUid,
        amount,
        contextUser,
        status = POINT_TRANSACTION_STATUS_ENUM.PAYMENT,
    }) {
        // Create && Use QueryRunner - SERIALIZABLE
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction('SERIALIZABLE');

        try {
            // 결제정보 저장
            const pointTransaction = this.pointTransactionRepository.create({
                impUid,
                amount: amount,
                user: contextUser,
                status,
            });
            // save with queryRunner (for Serializable transaction)
            await queryRunner.manager.save(pointTransaction);

            // 유저의 포인트 확인
            const user = await queryRunner.manager.findOne(
                User,
                { id: contextUser.id },
                { lock: { mode: 'pessimistic_write' } },
            );
            // 유저의 포인트 업데이트 (충전한 포인트 더해주기)
            const updatedUser = this.userRepository.create({
                ...user,
                point: user.point + amount,
            });
            await queryRunner.manager.save(updatedUser);

            await queryRunner.commitTransaction();
            // 최종결과를 프론트에 반환
            return pointTransaction;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.log(error);
        } finally {
            // End the connection of QueryRunner
            await queryRunner.release();
        }
    }

    // 이미 환불 되었는지 확인
    async checkAlreadyCanceled({ impUid }) {
        const order = await this.pointTransactionRepository.findOne({
            impUid,
            status: POINT_TRANSACTION_STATUS_ENUM.CANCEL,
        });
        if (order) throw new ConflictException('이미 환불 된 결제 건입니다 🫢');
    }

    // 환불하려는 결제가 존재하는지 검증
    async checkHasCancelablePoint({ impUid, contextUser }) {
        const order = await this.pointTransactionRepository.findOne({
            impUid,
            status: POINT_TRANSACTION_STATUS_ENUM.PAYMENT,
            user: { id: contextUser.id },
        });
        if (!order)
            throw new ConflictException('존재하지 않는 결제 건입니다 🫢');
        // 환불 가능 금액( 유저의 잔액 - 환불 된 총 금액) 계산
        const user = await this.userRepository.findOne({
            id: contextUser.id,
        });
        const amount = user.point;
        const cancelableAmount = amount - order.amount;
        // 환불 가능한 금액보다 요구가 클 경우
        if (cancelableAmount < 0)
            throw new ConflictException(
                '🤔 보유하고 있는 포인트 보다 환불 금액이 클 수 없습니다!',
            );
    }
    async cancel({ impUid, amount, contextUser }) {
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction('SERIALIZABLE');
        try {
            const pointTransaction = await this.create({
                impUid,
                amount: -amount,
                contextUser,
                status: POINT_TRANSACTION_STATUS_ENUM.CANCEL,
            });
            return pointTransaction;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.log(error);
        } finally {
            await queryRunner.release();
        }
    }
}
