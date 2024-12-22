import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Options } from "common/config/mongoose.config";
import { Document } from "mongoose";

export const BLOGS_MODEL = "blogs";

@Schema(Options)
export class Blogs {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  slug: string;

  @Prop({ required: true })
  catalog: string;

  @Prop({ required: true })
  user_name: string;

  @Prop({ required: true })
  user_image: string;
}

export type BlogsDocument = Blogs & Document;

export const BlogsSchema = SchemaFactory.createForClass(Blogs);