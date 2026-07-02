import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Schema()
export class LoginEvent {
  @Prop({ type: SchemaTypes.ObjectId, ref: Usuario.name, required: true })
  user_id: Types.ObjectId;

  @Prop({ default: Date.now })
  created: Date;
}

export const loginEventSchema = SchemaFactory.createForClass(LoginEvent);
