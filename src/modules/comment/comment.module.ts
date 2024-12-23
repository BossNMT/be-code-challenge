import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { COMMENT_MODEL, CommentSchema } from './schemas/comment.schema';
import { BlogModule } from 'modules/blog/blog.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: COMMENT_MODEL, schema: CommentSchema }]),
    BlogModule,
  ],
  controllers: [CommentController],
  providers: [CommentService]
})
export class CommentModule {}
