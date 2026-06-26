import { Module } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { PublicacionesController } from './publicaciones.controller';
import { Publicacion, publicacionSchema } from './entities/publicacion.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthGuard } from '../security/auth-verification.guard';
import { Comentario, comentarioSchema } from './entities/comentario.entity';
import { ComentariosService } from './comentarios.service';
import { ComentariosController } from './comentarios.controller';
import { SecurityModule } from 'src/security/security.module';

@Module({
  imports: [
    SecurityModule,
    MongooseModule.forFeature([
      {
        name: Publicacion.name,
        schema: publicacionSchema,
      },
      {
        name: Comentario.name,
        schema: comentarioSchema,
      },
    ]),
  ],
  providers: [PublicacionesService, AuthGuard, ComentariosService],
  controllers: [PublicacionesController, ComentariosController],
})
export class PublicacionesModule {}
