import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ContextUser, IContextUser } from 'src/commons/auth/gql-user.param';
import { GqlAuthEmailGuard } from 'src/commons/auth/graphql-auth.guard';
import { IamportService } from '../imaport/iamport.service';
import {
    PointTransaction,
    POINT_TRANSACTION_STATUS_ENUM,
} from './entities/pointTransaction.entity';
import { PointTransactionService } from './pointTransaction.service';

@Resolver()
export class PointTransactionResolver {
    constructor(
        private readonly pointTransactionService: PointTransactionService,
        private readonly iamportService: IamportService,
    ) {}
    @UseGuards(GqlAuthEmailGuard)
    @Mutation(() => PointTransaction)
    async createPointTransaction(
        @Args('impUid') impUid: string,
        @Args('amount') amount: number,
        @ContextUser() contextUser: IContextUser,
    ) {
        // 엑세스 토큰 새로 생성
        const accessToken = await this.iamportService.getToken();
        // 아임포트 측 거래기록 검증
        await this.iamportService.validateOrder({
            accessToken,
            impUid,
            amount,
        });
        // 결제 기록에 중복이 있는지 검증
        await this.pointTransactionService.checkDuplicate({ impUid });
        // 결제 저장
        return await this.pointTransactionService.create({
            impUid,
            amount,
            contextUser,
            status: POINT_TRANSACTION_STATUS_ENUM.PAYMENT,
        });
    }

    @UseGuards(GqlAuthEmailGuard)
    @Mutation(() => PointTransaction)
    async cancelPointTransaction(
        @Args('impUid') impUid: string,
        @Args('amount') amount: number,
        @ContextUser() contextUser: IContextUser,
    ) {
        // 이미 취소되었는지 확인
        await this.pointTransactionService.checkAlreadyCanceled({ impUid });
        // 취소하기에 충분한 잔액이 있는지 확인
        await this.pointTransactionService.checkHasCancelablePoint({
            impUid,
            contextUser,
        });
        // 아임포트에 취소 요청
        const accessToken = await this.iamportService.getToken();
        const canceledAmount = await this.iamportService.cancel({
            impUid,
            accessToken,
        });
        // 취소 결과 저장
        return await this.pointTransactionService.cancel({
            impUid,
            amount: canceledAmount,
            contextUser,
        });
    }
}
