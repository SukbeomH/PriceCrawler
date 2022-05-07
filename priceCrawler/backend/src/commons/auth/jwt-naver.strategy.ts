import { Strategy } from 'passport-naver-v2';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class JwtNaverStrategy extends PassportStrategy(Strategy, 'naver') {
    constructor() {
        super({
            clientID: process.env.OAUTH_NAVER_ID,
            clientSecret: process.env.OAUTH_NAVER_SECRET,
            callbackURL: process.env.OAUTH_NAVER_CALLBACK,
        });
    }

    validate(accessToken: string, refreshToken: string, profile: any) {
        console.log(profile);
        return {
            email: profile.email,
            password: String(Math.floor(Math.random() * 10 ** 9)),
            snsId: profile.id,
            provider: 'naver',
            auth: String(Math.floor(Math.random() * 10 ** 6)).padStart(6, '0'),
        };
    }
}
