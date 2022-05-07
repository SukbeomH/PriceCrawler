import {
    CACHE_MANAGER,
    Inject,
    UnprocessableEntityException,
    UseGuards,
} from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { ContextUser, IContextUser } from 'src/commons/auth/gql-user.param';
import {
    GqlAuthEmailGuard,
    GqlAuthRefreshGuard,
} from 'src/commons/auth/graphql-auth.guard';
import { UserService } from '../user/user.service';
import { Cache } from 'cache-manager';

@Resolver()
export class AuthResolver {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
    ) {}

    @Mutation(() => String)
    async login(
        @Args('email') email: string,
        @Args('password') password: string,
        @Context() context: any,
    ) {
        // console.log(context.req);
        // login => email && password 가 일치하는 유저 찾기
        const user = await this.userService.findOne({ email });
        // 일치하는 유저가 없으면 [ 에러 ]
        if (!user)
            throw new UnprocessableEntityException(
                '존재하지 않는 이메일 입니다',
            );
        // 일치하는 유저가 있지만 암호가 틀렸다면 [ 에러 ]
        const isAuth = await bcrypt.compare(password, user.password);
        if (!isAuth)
            throw new UnprocessableEntityException('잘못된 비밀번호 입니다');
        // [ Refresh Token - JWT ] 만들어서 프론트 쿠키로 전달
        this.authService.setRefreshToken({ user, res: context.res });

        // [ Access Token - JWT ] + 프론트로 전달
        const result = this.authService.getAccessToken({ user });
        return result;
    }

    @UseGuards(GqlAuthRefreshGuard)
    @Mutation(() => String)
    restoreAccessToken(@ContextUser() contextUser: IContextUser) {
        return this.authService.getAccessToken({ user: contextUser });
    }

    @UseGuards(GqlAuthEmailGuard)
    @Mutation(() => String)
    async logout(@Context() context: any) {
        // console.log(context.req);
        // refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXV
        const logout = await this.authService.logout({ req: context.req });
        return logout;
    }
}
