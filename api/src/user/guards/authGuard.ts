import {CanActivate, createParamDecorator, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {UserService} from "../user.service";

export const UserParam = createParamDecorator((data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user;
})


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly userService: UserService) {
    }

  async  canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const tokenHeader = request.headers['authorization'];
        if (!tokenHeader) {
            return false;
        }

        const splitToken = tokenHeader.split(' ');
        if (splitToken.length !== 2) {
            throw new UnauthorizedException("Invalid token");
        }

        const token = splitToken[1];
        const result = this.userService.checkToken(token);

        if (!result) {
            throw new UnauthorizedException("Invalid token");
        }

        const user = await this.userService.getUserById(result.id);
        if (!user) {
            throw new UnauthorizedException("Invalid token");
        }

        request.user = user;
        return true;
    }
}