import { Module } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { PublicacionesController } from './publicaciones.controller';
import { Publicacion, publicacionSchema } from './entities/publicacion.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { AuthGuard } from '../common/guards/auth-verification.guard';
import { Comentario, comentarioSchema } from './entities/comentario.entity';
import { ComentariosService } from './comentarios.service';
import { ComentariosController } from './comentarios.controller';

@Module({
  imports: [
    AuthModule,
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
