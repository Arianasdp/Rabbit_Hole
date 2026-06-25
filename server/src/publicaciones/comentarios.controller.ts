import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { AuthGuard } from 'src/common/guards/auth-verification.guard';
import * as express from 'express';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { EditarComentarioDto } from './dto/editar-comentario.dto';

@Controller('publicaciones/:publicacionId/comentarios')
export class ComentariosController {
  constructor(private readonly comentariosService: ComentariosService) {}

  @UseGuards(AuthGuard)
  @Post()
  crearComentario(
    @Param('publicacionId') publicacionId: string,
    @Req() req: express.Request,
    @Body() createComentarioDto: CreateComentarioDto,
  ) {
    return this.comentariosService.create(
      publicacionId,
      req['user'],
      createComentarioDto,
    );
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  editarComentario(
    @Param('id') comentarioId: string,
    @Req() req: express.Request,
    @Body() editarComentarioDto: EditarComentarioDto,
  ) {
    console.log('userid: ', req['user'].sub);
    return this.comentariosService.editar(
      comentarioId,
      req['user'].sub,
      editarComentarioDto,
    );
  }

  @UseGuards(AuthGuard)
  @Get()
  traerComentarios(
    @Param('publicacionId') publicacionId: string,
    @Query('offset') offset?: number,
    @Query('limit') limit?: number,
  ) {
    return this.comentariosService.traer(publicacionId, offset, limit);
  }
}
