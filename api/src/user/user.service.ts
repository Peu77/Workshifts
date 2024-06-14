import {Injectable} from '@nestjs/common';
import {TokenPayload, UserEntity, UserRole} from "./entities/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {compareSync, genSaltSync, hashSync} from "bcrypt";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {UserDto} from "./dtos/userDto";

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

    changePassword(user: UserEntity, oldPassword: string, newPassword: string) {
        if (!compareSync(oldPassword, user.password)) {
            throw new Error("Old password is invalid")
        }

        user.password = hashSync(newPassword, genSaltSync(10));
        return this.userRepository.save(user);
    }

    async applyDtoUser(userEntity: UserEntity, user: UserDto) {
        userEntity.name = user.name;
        userEntity.email = user.email;
        userEntity.color = user.color;
        if (user.password) {
            userEntity.password = hashSync(user.password, genSaltSync(10));
        }

        userEntity.role = user.isAdmin ? UserRole.ADMIN : UserRole.USER;
        return this.userRepository.save(userEntity);
    }
}
