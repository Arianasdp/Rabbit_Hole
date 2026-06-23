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
    file?: Express.Multer.File,
  ) {
    const datosPublicacion: any = {
      ...createPublicacionDto,
      author: user.sub,
    };

    if (file) {
      datosPublicacion.img = `/uploads/${file.filename}`;
    }

    const publicacionCreada =
      await this.PublicacionModel.create(datosPublicacion);
    return publicacionCreada;
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

    if (publicacion) {
      const tieneLike = publicacion.likes.includes(usuarioId);

      if (tieneLike) {
        return this.PublicacionModel.findByIdAndUpdate(
          id,
          {
            $pull: { likes: usuarioId },
          },
          { returnDocument: 'after' },
        ).populate('author');
      }

      return this.PublicacionModel.findByIdAndUpdate(
        id,
        {
          $addToSet: { likes: usuarioId },
        },
        { returnDocument: 'after' },
      ).populate('author');
    }
  }

  //   async deletPost(publiId: string, userId: string) {
  //     const chequear = await this.PublicacionModel.findById(publiId);

  //     if (new Types.ObjectId(userId) === chequear?.author._id) {
  //       return await this.PublicacionModel.findByIdAndUpdate(publiId, {
  //         $set: { deleted: true },
  //       });
  //     }
  //   }

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
}
