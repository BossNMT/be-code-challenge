import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Options } from "common/config/mongoose.config";
import { Document } from "mongoose";

export const COMMENT_MODEL = "comments";

@Schema(Options)
export class Comment {
  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  blog_id: string;

  @Prop({ required: true })
  user_name: string;

  @Prop({ required: true })
  user_image: string;
}

export type CommentDocument = Comment & Document;

export const CommentSchema = SchemaFactory.createForClass(Comment);