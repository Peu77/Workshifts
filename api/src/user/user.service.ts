import {BadRequestException, Injectable} from '@nestjs/common';
import {TokenPayload, UserEntity} from "./entities/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {compareSync} from "bcrypt";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>, private jwtService: JwtService) {
    }

    async checkEmailAndPassword(email: string, password: string): Promise<boolean> {
        const user = await this.getUserByEmail(email);
        return user && compareSync(password, user.password)
    }

    async createJwtToken(user: UserEntity): Promise<string> {
        return this.jwtService.sign({id: user.id, email: user.email});
    }

    checkToken(token: string): false | TokenPayload {
        try {
            return this.jwtService.verify<TokenPayload>(token);
        } catch (e) {
            return false;
        }
    }

    getUserByEmail(email: string) {
        return this.userRepository.findOneBy({email});
    }

    getUserById(id: number) {
        return this.userRepository.findOneBy({id});
    }
}
