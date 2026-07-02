import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ComentariosService } from '../publicaciones/comentarios.service';
import { AuthGuard } from 'src/security/auth-verification.guard';
import { PublicacionesService } from 'src/publicaciones/publicaciones.service';
import { EstadisticasService } from './estadisticas.service';
// import * as express from 'express';

@Controller('estadisticas')
export class EstadisticasController {
  constructor(
    private readonly comentariosService: ComentariosService,
    private readonly publicacionesService: PublicacionesService,
    private readonly estadisticasService: EstadisticasService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('comentarios')
  comentariosPorPeriodo(
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
  ) {
    return this.comentariosService.traerComentariosPorPeriodo(desde, hasta);
  }

  @UseGuards(AuthGuard)
  @Get('comentarios/publicacion')
  comentariosPorPublicacionYPeriodo(
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
  ) {
    return this.comentariosService.traerComentariosPorPublicacionYPeriodo(
      desde,
      hasta,
    );
  }

  @UseGuards(AuthGuard)
  @Get('publicaciones')
  publicacionesPorUsuario(
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
  ) {
    return this.publicacionesService.traerPublicacionesPorUsuario(desde, hasta);
  }

  @UseGuards(AuthGuard)
  @Get('likes')
  likesPorDia() {
    return this.estadisticasService.likesPorDia();
  }

  @UseGuards(AuthGuard)
  @Get('logins')
  loginsPorUsuario() {
    return this.estadisticasService.loginPorUsuario();
  }

  @UseGuards(AuthGuard)
  @Get('visitas')
  visitasAMiPerfil(@Req() req: Request) {
    const userId = req['user']?.sub;
    return this.estadisticasService.visitasAmiPerfil(userId);
  }
}
