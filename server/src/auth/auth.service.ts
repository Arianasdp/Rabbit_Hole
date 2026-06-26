import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LoginUsuarioDto } from '../usuarios/dto/login-usuario.dto';
// import { ConfigService } from '@nestjs/config';
// import {
//   sign,
//   verify,
//   TokenExpiredError,
//   JsonWebTokenError,
//   JwtPayload,
// } from 'jsonwebtoken';
import { HydratedDocument } from 'mongoose';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { JwtService } from '../security/jwt.service';

export type UsuarioDocument = HydratedDocument<Usuario>;

@Injectable()
export class AuthService {
  // private readonly jwtSecret: string;

  constructor(
    private readonly usuariosService: UsuariosService,
    private jwtService: JwtService,
    // private configService: ConfigService,
  ) {
    // this.jwtSecret = this.configService.get<string>('SUPER_SECRET_KEY')!;
  }

  async registrar(createUsuarioDto: CreateUsuarioDto, filePath: string) {
    const hash = await bcrypt.hash(createUsuarioDto.password, 10);

    createUsuarioDto.password = hash;

    const usuarioCreado = await this.usuariosService.create(
      createUsuarioDto,
      filePath,
    );

    console.log('img: ', usuarioCreado.img);

    return this.createToken(usuarioCreado);
  }

  async loguear(loginUsuarioDto: LoginUsuarioDto) {
    const usuarioEncontrado =
      await this.usuariosService.traerPorMail(loginUsuarioDto);

    return this.createToken(usuarioEncontrado);
  }

  createToken(user: UsuarioDocument) {
    const payload = {
      sub: user._id.toString(),
      username: user.username,
      role: user.profile,
    };

    const jwt = this.jwtService.signToken(payload);

    return {
      jwt,
    };
  }

  // verificar(authHeader: string) {
  //   if (!authHeader) throw new UnauthorizedException('Token faltante');

  //   const [tipo, token] = authHeader.split(' ');

  //   if (tipo !== 'Bearer') throw new UnauthorizedException('Formato inválido');

  //   try {
  //     const tokenValidado = verify(token, this.jwtSecret);

  //     return tokenValidado;
  //   } catch (error) {
  //     if (error instanceof TokenExpiredError) {
  //       throw new UnauthorizedException('Token expirado');
  //     }

  //     if (error instanceof JsonWebTokenError) {
  //       throw new UnauthorizedException('Falló la firma');
  //     }

  //     throw error;
  //   }
  // }

  // refrescar(authHeader: string) {
  //   const payload = this.verificar(authHeader);

  //   if (typeof payload === 'string') {
  //     throw new UnauthorizedException(payload);
  //   }

  //   const nuevoPayload = {
  //     sub: payload.sub,
  //     username: payload.username,
  //     role: payload.role,
  //   };

  //   const jwt = this.signToken(nuevoPayload);

  //   return {
  //     jwt,
  //   };
  // }

  // private signToken(payload: JwtPayload) {
  //   return sign(payload, this.jwtSecret, {
  //     algorithm: 'HS256',
  //     expiresIn: '15m',
  //   });
  // }

  async traerme(id: string) {
    return this.usuariosService.traerPorId(id);
  }
}
