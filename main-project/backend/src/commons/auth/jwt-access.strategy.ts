import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
    CACHE_MANAGER,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class JwtEmailStrategy extends PassportStrategy(Strategy, 'email') {
    constructor(
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.BACKEND_ACCESS_KEY,
            passReqToCallback: true,
        });
    }

    async validate(req, payload) {
        // console.log(payload);
        // console.log(req);
        const accessToken = req.headers.authorization.split(' ')[1];
        // is redis has the access token?
        const blacklist = await this.cacheManager.get(accessToken);
        if (blacklist === 'access') throw new UnauthorizedException();
        // context 의 .req 의 .user 로 리턴된다
        return {
            email: payload.email,
            id: payload.sub,
        };
    }
}
