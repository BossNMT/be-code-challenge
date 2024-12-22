import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BLOGS_MODEL, BlogsSchema } from './schemas/blogs.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: BLOGS_MODEL, schema: BlogsSchema }]),
  ],
  controllers: [BlogController],
  providers: [BlogService]
})
export class BlogModule {}
