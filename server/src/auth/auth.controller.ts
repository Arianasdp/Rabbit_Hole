import {
  Controller,
  Post,
  Body,
  Headers,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  BadRequestException,
  UseGuards,
  Get,
  Req,
} from '@nestjs/common';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';
import { AuthService } from './auth.service';
import { LoginUsuarioDto } from 'src/usuarios/dto/login-usuario.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/multer/multer.config';
import { AuthGuard } from 'src/common/guards/auth-verification.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registro')
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
    console.log(file);
    return this.authService.registrar(createUsuarioDto, file);
  }

  @Post('login')
  loguear(@Body() loginUsuarioDto: LoginUsuarioDto) {
    console.log(loginUsuarioDto);
    return this.authService.loguear(loginUsuarioDto);
  }

  @Post('autorizar')
  autorizar(@Headers('Authorization') authHeader: string) {
    return this.authService.verificar(authHeader);
  }

  @Post('refrescar')
  refrescar(@Headers('Authorization') authHeader: string) {
    return this.authService.refrescar(authHeader);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  me(@Req() req) {
    return this.authService.traerme(req.user.sub);
  }
}
