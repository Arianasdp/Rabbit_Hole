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
import { AuthGuard } from '../common/guards/auth-verification.guard';
import * as express from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { OptionalAuthGuard } from '../common/guards/optionalJWT.guard';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: 'dtpjfa6pc',
  api_key: '398759611723871',
  api_secret: 'OMRwLYKMhpHsFlf7NILWqI51VNk',
});

@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('img', {
      storage: new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
          public_id: (req, file) => `IMG_${Date.now()}`,
        },
      }),
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
    let filePath = '';
    if (file) {
      filePath = file.path;
    }
    console.log(req['user']);
    console.log(createPublicacionDto);
    return this.publicacionesService.create(
      createPublicacionDto,
      req['user'],
      filePath,
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
