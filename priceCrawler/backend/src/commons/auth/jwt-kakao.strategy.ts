import { Strategy } from 'passport-kakao';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class JwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
    constructor() {
        super({
            clientID: process.env.OAUTH_KAKAO_ID,
            callbackURL: process.env.OAUTH_KAKAO_CALLBACK,
        });
    }

    validate(accessToken: string, refreshToken: string, profile: any) {
        return {
            email: profile._json.kakao_account.email,
            password: String(Math.floor(Math.random() * 10 ** 9)),
            snsId: profile.id,
            provider: 'kakao',
            auth: String(Math.floor(Math.random() * 10 ** 6)).padStart(6, '0'),
        };
    }
}
