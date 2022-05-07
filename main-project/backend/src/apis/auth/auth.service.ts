import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
    ) {}

    setRefreshToken({ user, res }) {
        try {
            const refreshToken = this.jwtService.sign(
                { email: user.email, sub: user.id },
                { secret: process.env.BACKEND_REFRESH_KEY, expiresIn: '2w' },
            );
            //개발환경
            res.setHeader(
                'Set-Cookie',
                `refreshToken=${refreshToken}; path=/;`,
            );
            // 배포환경
            // res.setHeader('Access-Control-Allow-Origin', 'https://myfrontsite.com')
            // res.setHeader(
            //   'Set-Cookie',
            //   `refreshToken=${refreshToken}; path=/; domain=.mybacksite.com; SameSite=None; Secure; httpOnly;`
            // )
        } catch (error) {
            throw error;
        }
    }

    getAccessToken({ user }) {
        try {
            return this.jwtService.sign(
                { email: user.email, sub: user.id },
                { secret: process.env.BACKEND_ACCESS_KEY, expiresIn: '5h' },
            );
        } catch (error) {
            throw error;
        }
    }

    async loginSocial({ req, res }) {
        try {
            let user = await this.userService.findOne({
                email: req.user.email,
            });
            if (!user) {
                user = await this.userService.create({
                    email: req.user.email,
                    password: req.user.password,
                    snsId: req.user.snsId,
                    provider: req.user.provider,
                    point: req.user.point,
                    auth: req.user.auth,
                });
                res.redirect(
                    'http://localhost:5500/main-project/frontend/login/index.html',
                );
            } else {
                this.setRefreshToken({ user, res });
                res.redirect(
                    'http://localhost:5500/main-project/frontend/login/index.html',
                );
            }
        } catch (error) {
            throw error;
        }
    }

    async logout({ req }) {
        try {
            // 엑세스토큰과 리프레시토큰 가져오기
            const refreshToken = req.headers.cookie.split('=')[1];
            const accessToken = req.headers.authorization.split(' ')[1];
            // 토큰 2개 검증
            const verifyRefresh = await this.jwtService.verify(refreshToken, {
                secret: process.env.BACKEND_REFRESH_KEY,
            });
            const verifyAccess = await this.jwtService.verify(accessToken, {
                secret: process.env.BACKEND_ACCESS_KEY,
            });
            // 둘다 정상이면 레디스에 저장
            const now = Math.floor(Date.now() / 1000);
            console.log(now);

            // console.log(verifyAccess.exp);
            if (verifyAccess && verifyRefresh) {
                await this.cacheManager.set(refreshToken, 'refresh', {
                    ttl: verifyAccess.exp - verifyAccess.iat,
                });
                await this.cacheManager.set(accessToken, 'access', {
                    ttl: verifyRefresh.exp - verifyRefresh.iat,
                });
                return '로그아웃에 성공했습니다';
            }
        } catch (error) {
            throw error;
        }
    }
}
