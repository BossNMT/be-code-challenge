import { Options } from "common/config/mongoose.config";
import { Document, SchemaTypes } from "mongoose";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { TokenTypes } from "../constants/token.constant";
import { Role } from "common/constants/Role";

export const TOKENS_MODEL = "tokens";
@Schema(Options)
export class Tokens {
  @Prop({ required: true, index: true })
  token: string;

  @Prop({ type: SchemaTypes.ObjectId })
  user: string;

  @Prop()
  name: string;

  @Prop({ required: true, enum: Role })
  role: string

  @Prop({ enum: TokenTypes, required: true })
  type: string;

  @Prop({ required: true })
  expires: Date;

  @Prop({ required: true, default: false })
  blacklisted?: boolean;
}

export type TokensDocument = Tokens & Document;

export const TokensSchema = SchemaFactory.createForClass(Tokens);
