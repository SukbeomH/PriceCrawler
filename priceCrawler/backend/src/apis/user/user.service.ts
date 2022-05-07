import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async findAll() {
        return await this.userRepository.find();
    }

    async findOne({ email: email }) {
        // const UserMail = await this.userRepository.findOne({ email });
        // if (!UserMail)
        //     throw new ConflictException(
        //         '검색하려는 이메일이 존재하지 않습니다',
        //     );
        return await this.userRepository.findOne({ email });
    }

    async create({ email, password, snsId, provider, point, auth }) {
        // 기존 데이터베이스에 이미 메일주소가 있는지 찾는다
        const userMail = await this.userRepository.findOne({ email });
        // 이미 등록된 메일이라면 에러를 뱉도록 한다
        if (userMail) throw new ConflictException('이미 등록된 이메일입니다');

        const hashedPassword = await bcrypt.hash(password, 10);
        return await this.userRepository.save({
            email,
            password: hashedPassword,
            snsId,
            provider,
            point,
            auth,
        });
    }

    async updatePassword({ email, newPassword }) {
        const user = await this.userRepository.findOne({ where: { email } });
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        return await this.userRepository.save(user);
    }

    async delete({ email }) {
        const userMail = await this.userRepository.findOne({ email });
        if (!userMail)
            throw new ConflictException('삭제하려는 유저가 존재하지 않습니다');
        const result = await this.userRepository.delete({ email });
        return result.affected ? true : false;
    }
}
