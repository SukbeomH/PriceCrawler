import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
    CACHE_MANAGER,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
    constructor(
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
    ) {
        super({
            jwtFromRequest: (req) =>
                req.headers.cookie.replace('refreshToken=', ''),
            secretOrKey: process.env.BACKEND_REFRESH_KEY,
            passReqToCallback: true,
        });
    }

    async validate(req, payload) {
        // console.log(payload);
        // console.log(req);
        const refreshToken = req.headers.cookie.split('=')[1];
        // is redis has the access token?
        const blacklist = await this.cacheManager.get(refreshToken);
        if (blacklist === 'access') throw new UnauthorizedException();
        // context 의 .req 의 .user 로 리턴된다
        return {
            email: payload.email,
            id: payload.sub,
        };
    }
}
