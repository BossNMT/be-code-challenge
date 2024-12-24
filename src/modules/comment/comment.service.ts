import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { InjectModel } from "@nestjs/mongoose";
import { COMMENT_MODEL, CommentDocument } from "./schemas/comment.schema";
import { PaginateModel } from "mongoose";
import { BlogService } from "modules/blog/blog.service";

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(COMMENT_MODEL)
    private readonly commentModel: PaginateModel<CommentDocument>,
    private readonly blogService: BlogService
  ) {}

  async create(blogId: string, createCommentDto: CreateCommentDto) {
    if (!blogId) {
      throw new BadRequestException("Blog id is required");
    }

    const checkBlog = await this.blogService.findOneId(blogId);

    if (!checkBlog) {
      throw new BadRequestException("Blog not found");
    }

    const comment = await this.commentModel.create({
      content: createCommentDto.content,
      user_name: "Guest",
      user_image: "2f10774911cdbb79b5a63f81caabe5f4.jpeg",
      blog_id: blogId,
    });

    return {
      data: comment
    };
  }

  async findAllCommentBlog(blogId: string, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const [comments, total] = await Promise.all([
        this.commentModel
          .find({ blog_id: blogId })
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .exec(),
        this.commentModel.countDocuments({ blog_id: blogId }).exec(),
      ]);

      return {
        data: {
          data: comments,
          meta: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalRecords: total,
          },
        },
      };
    } catch (error) {
      throw new BadRequestException(
        "Failed to fetch Comment. Please try again later."
      );
    }
  }
}
