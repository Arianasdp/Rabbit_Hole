import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Publicacion } from './publicacion.entity';

@Schema()
export class LikeEvent {
  @Prop({ type: SchemaTypes.ObjectId, ref: Publicacion.name, required: true })
  publicacion_id: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: Usuario.name, required: true })
  author: Types.ObjectId;

  @Prop({ default: Date.now })
  created: Date;

  @Prop({ default: false })
  deleted: boolean;
}

export const likeEventSchema = SchemaFactory.createForClass(LikeEvent);
