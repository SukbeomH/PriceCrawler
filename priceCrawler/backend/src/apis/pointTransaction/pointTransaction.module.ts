import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtEmailStrategy } from 'src/commons/auth/jwt-access.strategy';
import { IamportService } from '../imaport/iamport.service';
import { User } from '../user/entities/user.entity';
import { PointTransaction } from './entities/pointTransaction.entity';
import { PointTransactionResolver } from './pointTransaction.resolver';
import { PointTransactionService } from './pointTransaction.service';

@Module({
    imports: [TypeOrmModule.forFeature([PointTransaction, User])],
    providers: [
        JwtEmailStrategy,
        PointTransactionResolver,
        PointTransactionService,
        IamportService,
    ],
})
export class PointTransactionModule {}
