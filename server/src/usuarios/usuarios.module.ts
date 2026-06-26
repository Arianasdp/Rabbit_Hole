import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuario, usuarioSchema } from './entities/usuario.entity';
import { UsuariosController } from './usuarios.controller';
import { AuthGuard } from '../security/auth-verification.guard';
import { SecurityModule } from 'src/security/security.module';

@Module({
  imports: [
    SecurityModule,
    MongooseModule.forFeature([
      {
        name: Usuario.name,
        schema: usuarioSchema,
      },
    ]),
  ],
  providers: [UsuariosService, AuthGuard],
  controllers: [UsuariosController],
  exports: [UsuariosService],
})
export class UsuariosModule {}
