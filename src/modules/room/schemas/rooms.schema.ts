import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Options } from "common/config/mongoose.config";
import { Document } from "mongoose";

export const ROOMS_MODEL = "rooms";

@Schema(Options)
export class Rooms {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  altText: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  index: number;
}

export type RoomsDocument = Rooms & Document;

export const RoomsSchema = SchemaFactory.createForClass(Rooms);