import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from './jwt.service';
import { AuthGuard } from './auth-verification.guard';

@Module({
  imports: [ConfigModule],
  providers: [JwtService, AuthGuard],
  exports: [JwtService, AuthGuard],
})
export class SecurityModule {}
