import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LoginUsuarioDto } from '../usuarios/dto/login-usuario.dto';
import { HydratedDocument } from 'mongoose';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { JwtService } from '../security/jwt.service';

export type UsuarioDocument = HydratedDocument<Usuario>;

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private jwtService: JwtService,
  ) {}

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

    if (usuarioEncontrado.deleted) {
      throw new ForbiddenException('El usuario ha sido deshabilitado');
    }

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

  async traerUser(id: string) {
    return this.usuariosService.traerPorId(id);
  }
}
