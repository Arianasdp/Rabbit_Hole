import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Usuario } from './entities/usuario.entity';
import { Model } from 'mongoose';
import { LoginUsuarioDto } from './dto/login-usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel(Usuario.name) private UsuarioModel: Model<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto, imagePath: string) {
    const usuarioExistente = await this.UsuarioModel.findOne({
      $or: [
        { email: createUsuarioDto.email },
        { username: createUsuarioDto.username },
      ],
    });

    if (usuarioExistente) {
      if (usuarioExistente.email === createUsuarioDto.email) {
        throw new ConflictException('El email ya está registrado');
      }

      throw new ConflictException('El nombre de usuario ya está en uso');
    }

    return this.UsuarioModel.create({
      ...createUsuarioDto,
      img: imagePath,
    });
  }

  async traerPorMail(loginUsuarioDto: LoginUsuarioDto) {
    console.log(loginUsuarioDto);
    const usuarioEncontrado = await this.UsuarioModel.findOne({
      email: loginUsuarioDto.email,
    });
    console.log('encontrado:', usuarioEncontrado);
    if (!usuarioEncontrado) {
      throw new UnauthorizedException('Mail incorrecto');
    }

    const passwordValida = await bcrypt.compare(
      loginUsuarioDto.password,
      usuarioEncontrado.password,
    );

    console.log('password coincide:', passwordValida);

    if (!passwordValida) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    return usuarioEncontrado;
  }

  async traerPorId(id: string) {
    return this.UsuarioModel.findById(id).select(
      '_id profile name surname username img email birthdate description',
    );
  }

  async traer() {
    return await this.UsuarioModel.find();
  }

  async delete(id: string) {
    await this.UsuarioModel.findByIdAndUpdate(id, {
      deleted: true,
    });
  }

  async habilitar(id: string) {
    await this.UsuarioModel.findByIdAndUpdate(id, {
      deleted: false,
    });
  }
}
