import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Options } from "common/config/mongoose.config";
import { Document } from "mongoose";

export const PRODUCTS_MODEL = "products";

@Schema()
export class DotCoordinates {
  @Prop({ required: true })
  x: number;

  @Prop({ required: true })
  y: number;
}

export const DotCoordinatesSchema =
  SchemaFactory.createForClass(DotCoordinates);

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

  @Prop({ required: true, type: DotCoordinatesSchema })
  dotCoordinates: DotCoordinates;
}

export type ProductsDocument = Products & Document;

export const ProductsSchema = SchemaFactory.createForClass(Products);
