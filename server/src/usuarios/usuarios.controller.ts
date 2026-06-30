import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
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

  @UseGuards(AuthGuard)
  @Patch(':id/toggle-delete')
  toggleDelete(@Param('id') id: string) {
    return this.usuariosService.toggleDelete(id);
  }
}
