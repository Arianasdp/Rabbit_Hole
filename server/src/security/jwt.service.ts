import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  JsonWebTokenError,
  JwtPayload,
  sign,
  TokenExpiredError,
  verify,
} from 'jsonwebtoken';

@Injectable()
export class JwtService {
  private readonly jwtSecret: string;

  constructor(private configService: ConfigService) {
    this.jwtSecret = this.configService.get<string>('SUPER_SECRET_KEY')!;
  }

  verificar(authHeader: string) {
    if (!authHeader) throw new UnauthorizedException('Token faltante');

    const [tipo, token] = authHeader.split(' ');

    if (tipo !== 'Bearer') throw new UnauthorizedException('Formato inválido');

    try {
      const tokenValidado = verify(token, this.jwtSecret);

      return tokenValidado;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token expirado');
      }

      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Falló la firma');
      }

      throw error;
    }
  }

  refrescar(authHeader: string) {
    const payload = this.verificar(authHeader);

    if (typeof payload === 'string') {
      throw new UnauthorizedException(payload);
    }

    const nuevoPayload = {
      sub: payload.sub,
      username: payload.username,
      role: payload.role,
    };

    const jwt = this.signToken(nuevoPayload);

    return {
      jwt,
    };
  }

  signToken(payload: JwtPayload) {
    return sign(payload, this.jwtSecret, {
      algorithm: 'HS256',
      expiresIn: '15m',
    });
  }
}
