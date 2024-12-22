import { Options } from "common/config/mongoose.config";
import { Role } from "common/constants/Role";
import { Document } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Exclude } from "class-transformer";

export const AUTHS_MODEL = "auths";

@Schema(Options)
export class Auths {
  @Prop({ required: true })
  phone: string;
  
  @Exclude()
  @Prop({ require: true, trim: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ require: true, enum: Role, default: Role.USER })
  role: string;

  @Prop({ default: null })
  games: string[];

  @Prop({ default: true })
  active: boolean;

  @Prop({ default: null })
  note: string;
}

export type AuthsDocument = Auths & Document;

export const AuthsSchema = SchemaFactory.createForClass(Auths);
