import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from './role.schema';
export type UserDocument = User & Document;

@Schema()
export class User extends Role {
  @Prop()
  userId: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  fullName: string;

  @Prop()
  passWordHint: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
