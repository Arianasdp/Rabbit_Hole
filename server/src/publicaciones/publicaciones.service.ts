import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Publicacion } from './entities/publicacion.entity';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';

@Injectable()
export class PublicacionesService {
  constructor(
    @InjectModel(Publicacion.name) private PublicacionModel: Model<Publicacion>,
  ) {}

  async create(
    createPublicacionDto: CreatePublicacionDto,
    user: any,
    filePath?: string,
  ) {
    const datosPublicacion: any = {
      ...createPublicacionDto,
      author: user.sub,
    };

    if (filePath) {
      datosPublicacion.img = filePath;
    }

    const publicacionCreada =
      await this.PublicacionModel.create(datosPublicacion);

    const resultado = await this.PublicacionModel.findById(
      publicacionCreada._id,
    ).populate('author');

    console.log(JSON.stringify(resultado, null, 2));

    return resultado;
  }

  async find(
    sort?: string,
    author?: string,
    offset = 0,
    limit = 10,
    userId?: string,
  ) {
    const sortField: Record<string, 1 | -1> =
      sort === 'likes' ? { likesCount: -1 } : { created: -1 };

    return this.PublicacionModel.aggregate([
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
          deleted: false,
          ...(author && { 'authorData.username': author }),
        },
      },
      {
        $addFields: {
          likesCount: {
            $size: '$likes',
          },
          likedByUser: userId
            ? {
                $in: [userId, '$likes'],
              }
            : false,
        },
      },
      {
        $sort: sortField,
      },
      {
        $skip: Number(offset),
      },
      {
        $limit: Number(limit),
      },
      {
        $project: {
          title: 1,
          description: 1,
          img: 1,
          created: 1,
          likesCount: 1,
          likedByUser: 1,
          author: {
            _id: '$authorData._id',
            username: '$authorData.username',
            img: '$authorData.img',
          },
        },
      },
    ]);
  }

  async findInfinito(sort?: string, author?: string, userId?: string) {
    const sortField: Record<string, 1 | -1> =
      sort === 'likes' ? { likesCount: -1 } : { created: -1 };

    return this.PublicacionModel.aggregate([
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
          deleted: false,
          ...(author && { 'authorData.username': author }),
        },
      },
      {
        $addFields: {
          likesCount: {
            $size: '$likes',
          },
          likedByUser: userId
            ? {
                $in: [userId, '$likes'],
              }
            : false,
        },
      },
      {
        $sort: sortField,
      },
      {
        $project: {
          title: 1,
          description: 1,
          img: 1,
          created: 1,
          likesCount: 1,
          likedByUser: 1,
          author: {
            _id: '$authorData._id',
            username: '$authorData.username',
            img: '$authorData.img',
          },
        },
      },
    ]);
  }

  async toggleLike(id: string, usuarioId: string) {
    const publicacion = await this.PublicacionModel.findById(id);
    console.log(publicacion);

    if (!publicacion) {
      return null;
    }

    const tieneLike = publicacion.likes.includes(usuarioId);

    let publicacionActualizada;

    if (tieneLike) {
      publicacionActualizada = await this.PublicacionModel.findByIdAndUpdate(
        id,
        {
          $pull: { likes: usuarioId },
        },
        { returnDocument: 'after' },
      ).populate('author');
    } else {
      publicacionActualizada = await this.PublicacionModel.findByIdAndUpdate(
        id,
        {
          $addToSet: { likes: usuarioId },
        },
        { returnDocument: 'after' },
      ).populate('author');
    }

    return {
      ...publicacionActualizada.toObject(),
      likesCount: publicacionActualizada.likes.length,
      likedByUser: publicacionActualizada.likes.includes(usuarioId),
    };
  }

  async remove(id: string, userId: string) {
    const publicacion = await this.PublicacionModel.findById(id);

    if (!publicacion) {
      throw new NotFoundException();
    }

    if (publicacion.author.toString() !== userId) {
      throw new ForbiddenException();
    }

    await this.PublicacionModel.findByIdAndUpdate(id, {
      deleted: true,
    });

    return {
      message: 'Publicación eliminada',
    };
  }

  async findPublicacionPorId(id: string) {
    return this.PublicacionModel.find({ _id: id, deleted: false });
  }
}
