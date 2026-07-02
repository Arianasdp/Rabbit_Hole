import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LoginEvent } from '../auth/entities/loginEvent.entity';
import { ProfileVisit } from '../auth/entities/profileVisit.entity';
import { LikeEvent } from '../publicaciones/entities/likeEvent.entity';

@Injectable()
export class EstadisticasService {
  constructor(
    @InjectModel(LikeEvent.name) private LikeEventModel: Model<LikeEvent>,
    @InjectModel(LoginEvent.name) private LoginEventModel: Model<LoginEvent>,
    @InjectModel(ProfileVisit.name)
    private ProfileVisitModel: Model<ProfileVisit>,
  ) {}

  likesPorDia() {
    return this.LikeEventModel.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$created',
            },
          },
          cantidad: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);
  }

  loginPorUsuario() {
    return this.LoginEventModel.aggregate([
      {
        $group: {
          _id: '$user_id',
          cantidad: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'usuarios',
          localField: '_id',
          foreignField: '_id',
          as: 'usuario',
        },
      },
      {
        $unwind: '$usuario',
      },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          username: '$usuario.username',
          cantidad: 1,
        },
      },
      {
        $sort: {
          cantidad: -1,
        },
      },
    ]);
  }

  visitasAmiPerfil(id: string) {
    return this.ProfileVisitModel.aggregate([
      {
        $match: {
          visited_id: new Types.ObjectId(id),
        },
      },
      {
        $group: {
          _id: '$visitor_id',
          cantidad: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'usuarios',
          localField: '_id',
          foreignField: '_id',
          as: 'usuario',
        },
      },
      {
        $unwind: '$usuario',
      },
      {
        $project: {
          _id: 0,
          username: '$usuario.username',
          cantidad: 1,
        },
      },
      {
        $sort: {
          cantidad: -1,
        },
      },
    ]);
  }
}
