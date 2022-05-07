import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtEmailStrategy } from 'src/commons/auth/jwt-access.strategy';
import { User } from './entities/user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [JwtEmailStrategy, UserResolver, UserService],
})
export class UserModule {}
