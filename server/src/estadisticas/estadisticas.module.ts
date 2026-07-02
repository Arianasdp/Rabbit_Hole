import { Module } from '@nestjs/common';
import { EstadisticasController } from './estadisticas.controller';
import { AuthGuard } from '../security/auth-verification.guard';
import { SecurityModule } from '../security/security.module';
import { PublicacionesModule } from '../publicaciones/publicaciones.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  LoginEvent,
  loginEventSchema,
} from '../auth/entities/loginEvent.entity';
import {
  LikeEvent,
  likeEventSchema,
} from '../publicaciones/entities/likeEvent.entity';
import {
  ProfileVisit,
  profileVisitSchema,
} from '../auth/entities/profileVisit.entity';
import { EstadisticasService } from './estadisticas.service';

@Module({
  imports: [
    SecurityModule,
    PublicacionesModule,
    MongooseModule.forFeature([
      { name: LoginEvent.name, schema: loginEventSchema },
      { name: LikeEvent.name, schema: likeEventSchema },
      { name: ProfileVisit.name, schema: profileVisitSchema },
    ]),
  ],
  controllers: [EstadisticasController],
  providers: [AuthGuard, EstadisticasService],
})
export class EstadisticasModule {}
