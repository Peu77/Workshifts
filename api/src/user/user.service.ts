import {Injectable} from '@nestjs/common';
import {TokenPayload, UserEntity, UserRole} from "./entities/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {compareSync, genSaltSync, hashSync} from "bcrypt";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {
        (async () => {
            const adminEmail = configService.getOrThrow<string>("ADMIN_EMAIL");
            let adminUser = await this.getUserByEmail(adminEmail);
            if (!adminUser) {
                adminUser = new UserEntity();
                adminUser.email = adminEmail
                adminUser.name = "admin"
                adminUser.role = UserRole.ADMIN
                adminUser.password = hashSync(configService.getOrThrow<string>("ADMIN_PASSWORD"), genSaltSync(10));
                await this.userRepository.save(adminUser);
            }
        })()
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

    getUserList() {
        return this.userRepository.find();
    }

    deleteUser(id: number) {
        return this.userRepository.delete({id});
    }

    createUser(name: string, email: string, password: string) {
        const user = new UserEntity();
        user.name = name;
        user.email = email;
        user.role = UserRole.USER;
        user.password = hashSync(password, genSaltSync(10));
        return this.userRepository.save(user);
    }
}
