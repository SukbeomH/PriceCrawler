import { Strategy } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class JwtGoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            clientID: process.env.OAUTH_GOOGLE_ID,
            clientSecret: process.env.OAUTH_GOOGLE_SECRET,
            callbackURL: process.env.OAUTH_GOOGLE_CALLBACK,
            scope: ['email', 'profile'],
        });
    }

    validate(accessToken: string, refreshToken: string, profile: any) {
        return {
            email: profile.emails[0].value,
            password: String(Math.floor(Math.random() * 10 ** 9)),
            snsId: profile.id,
            provider: 'google',
            auth: String(Math.floor(Math.random() * 10 ** 6)).padStart(6, '0'),
        };
    }
}
