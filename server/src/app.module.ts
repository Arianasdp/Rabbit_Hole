import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_PIPE } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { PublicacionesModule } from './publicaciones/publicaciones.module';
import { SecurityModule } from './security/security.module';
import { EstadisticasModule } from './estadisticas/estadisticas.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    UsuariosModule,
    AuthModule,
    PublicacionesModule,
    SecurityModule,
    EstadisticasModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
