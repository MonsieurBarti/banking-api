import { CanActivate, ExecutionContext } from '@nestjs/common';
import { verify } from 'jsonwebtoken';

export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return false;
    } else {
      await verify(request.headers.authorization, process.env.JWT_SECRET);
    }
    return true;
  }
}
