import {
  Controller,
  Post,
  Body,
  Headers,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  UseGuards,
  Get,
  Req,
  Param,
} from '@nestjs/common';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';
import { AuthService } from './auth.service';
import { LoginUsuarioDto } from '../usuarios/dto/login-usuario.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../security/auth-verification.guard';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { JwtService } from '../security/jwt.service';

cloudinary.config({
  cloud_name: 'dtpjfa6pc',
  api_key: '398759611723871',
  api_secret: 'OMRwLYKMhpHsFlf7NILWqI51VNk',
});

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

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
    return this.authService.registrar(createUsuarioDto, file.path);
  }

  @Post('login')
  loguear(@Body() loginUsuarioDto: LoginUsuarioDto) {
    console.log(loginUsuarioDto);
    return this.authService.loguear(loginUsuarioDto);
  }

  @Post('autorizar')
  autorizar(@Headers('Authorization') authHeader: string) {
    return this.jwtService.verificar(authHeader);
  }

  @Post('refrescar')
  refrescar(@Headers('Authorization') authHeader: string) {
    return this.jwtService.refrescar(authHeader);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  me(@Req() req) {
    return this.authService.traerme(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Get('users/:id')
  user(@Req() req, @Param('id') id: string) {
    return this.authService.traerUser(id, req.user.sub);
  }
}
