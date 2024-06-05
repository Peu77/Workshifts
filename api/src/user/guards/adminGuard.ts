import {ExecutionContext, Injectable} from "@nestjs/common";
import {UserRole} from "../entities/user.entity";


@Injectable()
export class AdminGuard {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        return request.user.role === UserRole.ADMIN;
    }
}