import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Comment')
@Controller('api/comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('create/:blogId')
  async create(@Param('blogId') blogId: string, @Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(blogId, createCommentDto);
  }

  @Get('get-all-comment-blog/:blogId')
  findAllCommentBlog(@Param('blogId') blogId: string, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.commentService.findAllCommentBlog(blogId, page, limit);
  }
}
