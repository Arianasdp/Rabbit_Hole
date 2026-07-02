import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Schema()
export class ProfileVisit {
  @Prop({ type: SchemaTypes.ObjectId, ref: Usuario.name, required: true })
  visitor_id: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: Usuario.name, required: true })
  visited_id: Types.ObjectId;

  @Prop({ default: Date.now })
  created: Date;
}

export const profileVisitSchema = SchemaFactory.createForClass(ProfileVisit);
