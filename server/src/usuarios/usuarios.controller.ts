import {
  Body,
  Controller,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '../security/auth-verification.guard';
import { UsuariosService } from './usuarios.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

cloudinary.config({
  cloud_name: 'dtpjfa6pc',
  api_key: '398759611723871',
  api_secret: 'OMRwLYKMhpHsFlf7NILWqI51VNk',
});

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

  @UseGuards(AuthGuard)
  @Post('registro')
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
  registrar(
    @Body() createUsuarioDto: CreateUsuarioDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    console.log(file.path);
    return this.usuariosService.registrarUser(createUsuarioDto, file.path);
  }
}
