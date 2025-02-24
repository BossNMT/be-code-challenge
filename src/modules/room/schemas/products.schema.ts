import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Options } from "common/config/mongoose.config";

export const PRODUCTS_MODEL = "products";

@Schema(Options)
export class Products {
  @Prop({ required: true })
  room_id: string;

  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  index: number;

  @Prop({ required: true })
  tagPosition: string;

  @Prop({ required: true })
  dotCoordinates: Object;
}

export type ProductsDocument = Products & Document;

export const ProductsSchema = SchemaFactory.createForClass(Products);