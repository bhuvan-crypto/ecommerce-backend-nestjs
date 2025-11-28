
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../../types/user';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ type: String, enum: Role, default: Role.CUSTOMER })
  role: Role;

  @Prop({ unique: true, required: true,type: String })
  username: string;

  @Prop({ required: true })
  passwordHash: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
