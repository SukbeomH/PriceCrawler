import {
    ConflictException,
    HttpException,
    Injectable,
    UnprocessableEntityException,
} from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class IamportService {
    async getToken() {
        try {
            // 액세스 토큰(access token) 발급 받기
            const getToken = await axios.post(
                'https://api.iamport.kr/users/getToken',
                {
                    imp_key: process.env.IAMPORT_API_KEY,
                    imp_secret: process.env.IAMPORT_SECRET,
                },
                { headers: { 'Content-Type': 'application/json' } },
            );
            const { access_token } = getToken.data.response; // 인증 토큰
            return access_token;
        } catch (error) {
            throw new HttpException(
                error.response.data.message,
                error.response.status,
            );
        }
    }

    async validateOrder({ accessToken, impUid, amount }) {
        try {
            // imp_uid로 아임포트 서버에서 결제 정보 조회
            const getPaymentData = await axios.get(
                `https://api.iamport.kr/payments/${impUid}`,
                { headers: { Authorization: accessToken } },
            );
            // 조회한 결제 정보
            const paymentData = getPaymentData.data.response;
            // 결제이력 확인
            if (paymentData.status !== 'paid')
                throw new ConflictException(
                    '오류: 결제 이력이 존재하지 않음 😫',
                );
            // 금액 확인
            const amountToBePaid = amount;
            if (paymentData.amount !== amountToBePaid)
                throw new UnprocessableEntityException(
                    '오류: 결제금액이 맞지 않습니다 👿',
                );
        } catch (error) {
            if (error?.response?.data?.message) {
                throw new HttpException(
                    error.response.data.message,
                    error.response.status,
                );
            } else {
                throw error;
            }
        }
    }

    async cancel({ accessToken, impUid }) {
        try {
            const getCancelData = await axios.post(
                'https://api.iamport.kr/payments/cancel',
                { imp_uid: impUid },
                { headers: { Authorization: accessToken } },
            );
            // 환불 결과
            const { response } = getCancelData.data;
            return response.cancel_amount;
        } catch (error) {
            throw new HttpException(
                error.response.data.message,
                error.response.status,
            );
        }
    }
}
