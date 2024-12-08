import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type RoleDocument = Role & Document;

@Schema()
export class Role {
  @Prop({
    default: 'user',
    enum: ['user', 'admin'],
  })
  roleName?: string;
}

export const UserSchme = SchemaFactory.createForClass(Role);
