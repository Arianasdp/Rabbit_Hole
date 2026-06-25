import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comentario } from './entities/comentario.entity';
import { Model, Types } from 'mongoose';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { PublicacionesService } from './publicaciones.service';
import { EditarComentarioDto } from './dto/editar-comentario.dto';

@Injectable()
export class ComentariosService {
  constructor(
    @InjectModel(Comentario.name) private ComentarioModel: Model<Comentario>,
    private readonly publicacionesService: PublicacionesService,
  ) {}

  async create(
    publicacionId: string,
    user: any,
    createComentarioDto: CreateComentarioDto,
  ) {
    const publicacion =
      await this.publicacionesService.findPublicacionPorId(publicacionId);
    console.log(publicacion);

    if (!publicacion) {
      return null;
    }
    const respuesta = await this.ComentarioModel.create({
      ...createComentarioDto,
      author: user.sub,
      publicacion_id: publicacionId,
    });

    const resultado = await this.ComentarioModel.findById(
      respuesta._id,
    ).populate('author');

    return resultado;
  }

  async editar(
    id: string,
    userId: string,
    editarComentarioDto: EditarComentarioDto,
  ) {
    const comentario = await this.ComentarioModel.findById(id);

    console.log('autor: ', comentario?.author.toString());

    if (!comentario) {
      throw new NotFoundException();
    }

    if (comentario.author.toString() !== userId) {
      throw new ForbiddenException();
    }

    const comentarioActualizado = await this.ComentarioModel.findByIdAndUpdate(
      id,
      {
        description: editarComentarioDto.description,
        edited: true,
      },
    );

    return comentarioActualizado;
  }

  async traer(publicacionId: string, offset = 0, limit = 10) {
    // return this.ComentarioModel.findById(publicacionId).sort({ created: -1 });
    return this.ComentarioModel.aggregate([
      {
        $lookup: {
          from: 'usuarios',
          localField: 'author',
          foreignField: '_id',
          as: 'authorData',
        },
      },
      {
        $unwind: '$authorData',
      },
      {
        $match: {
          publicacion_id: new Types.ObjectId(publicacionId),
        },
      },
      {
        $sort: { created: -1 },
      },
      {
        $skip: Number(offset),
      },
      {
        $limit: Number(limit),
      },
      {
        $project: {
          description: 1,
          created: 1,
          edited: 1,
          author: {
            username: '$authorData.username',
            img: '$authorData.img',
          },
        },
      },
    ]);
  }
}
