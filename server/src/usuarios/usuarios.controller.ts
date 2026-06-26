import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../security/auth-verification.guard';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @UseGuards(AuthGuard)
  @Get()
  traerUsuarios() {
    return this.usuariosService.traer();
  }
}
