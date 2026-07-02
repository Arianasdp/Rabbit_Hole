import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { AuthGuard } from '../security/auth-verification.guard';
import { SecurityModule } from 'src/security/security.module';
import { LoginEvent, loginEventSchema } from './entities/loginEvent.entity';
import {
  ProfileVisit,
  profileVisitSchema,
} from './entities/profileVisit.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    UsuariosModule,
    SecurityModule,
    MongooseModule.forFeature([
      {
        name: LoginEvent.name,
        schema: loginEventSchema,
      },
      {
        name: ProfileVisit.name,
        schema: profileVisitSchema,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
})
export class AuthModule {}
