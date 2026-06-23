import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { PublicacionesService } from './publicaciones.service';
import { AuthGuard } from 'src/common/guards/auth-verification.guard';
import * as express from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/multer/multer.config';
import { OptionalAuthGuard } from 'src/common/guards/optionalJWT.guard';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('img', {
      ...multerOptions,
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpeg|png|gif|webp)$/)) {
          return cb(
            new BadRequestException('Solo se permiten imágenes'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  crearPublicacion(
    @Req() req: express.Request,
    @Body() createPublicacionDto: CreatePublicacionDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024,
          }),
        ],
      }),
    )
    file?: Express.Multer.File,
  ) {
    console.log(file);
    console.log(req['user']);
    console.log(createPublicacionDto);
    return this.publicacionesService.create(
      createPublicacionDto,
      req['user'],
      file,
    );
  }

  @UseGuards(OptionalAuthGuard)
  @Get()
  traerPublicaciones(
    @Req() req: Request,
    @Query('sort') sort?: string,
    @Query('author') author?: string,
    @Query('offset') offset?: number,
    @Query('limit') limit?: number,
  ) {
    console.log({
      sort,
      author,
      offset,
      limit,
    });
    const userId = req['user']?.sub;
    return this.publicacionesService.find(sort, author, offset, limit, userId);
  }

  @UseGuards(AuthGuard)
  @Patch(':id/toggle-like')
  toggleLike(@Param('id') id: string, @Req() req) {
    console.log('id publi ', id);
    console.log('user ', req.user);
    console.log('user ', req.user._id);
    return this.publicacionesService.toggleLike(id, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  deletMyPost(@Param('id') id: string, @Req() req) {
    const userId = req['user']?.sub;
    return this.publicacionesService.remove(id, userId);
  }
}
