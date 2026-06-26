import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { AuthGuard } from '../security/auth-verification.guard';
import { SecurityModule } from 'src/security/security.module';

@Module({
  imports: [UsuariosModule, SecurityModule],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
})
export class AuthModule {}
