import { Module } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { PublicacionesController } from './publicaciones.controller';
import { Publicacion, publicacionSchema } from './entities/publicacion.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { AuthGuard } from 'src/common/guards/auth-verification.guard';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {
        name: Publicacion.name,
        schema: publicacionSchema,
      },
    ]),
  ],
  providers: [PublicacionesService, AuthGuard],
  controllers: [PublicacionesController],
})
export class PublicacionesModule {}
