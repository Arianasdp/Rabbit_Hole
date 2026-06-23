import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;

    if (!authHeader) {
      request.user = undefined;
      return true;
    }

    try {
      const payload = this.authService.verificar(authHeader);
      request.user = payload;
    } catch {
      request.user = undefined;
    }

    return true;
  }
}
