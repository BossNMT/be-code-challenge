import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { UpdateBlogDto } from "./dto/update-blog.dto";
import { PaginateModel } from "mongoose";
import { BLOGS_MODEL, BlogsDocument } from "./schemas/blogs.schema";
import { InjectModel } from "@nestjs/mongoose";
import { convertToSlug } from "common/utils/convertToSlug";

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(BLOGS_MODEL)
    private readonly blogModel: PaginateModel<BlogsDocument>
  ) {}

  async create(createBlogDto: CreateBlogDto) {
    const slug = convertToSlug(createBlogDto.title);

    const blog = await this.blogModel.create({
      ...createBlogDto,
      slug,
    });

    return blog;
  }

  async findAll(page: number = 1, limit: number = 10) {
    try {
      // Tính toán số lượng tài liệu cần bỏ qua (skip)
      const skip = (page - 1) * limit;

      // Lấy danh sách blog và tổng số blog
      const [blogs, total] = await Promise.all([
        this.blogModel.find().skip(skip).limit(limit).exec(), // Lấy dữ liệu với phân trang
        this.blogModel.countDocuments().exec(), // Đếm tổng số tài liệu
      ]);

      // Trả về kết quả theo định dạng chuẩn
      return {
        data: {
          data: blogs,
          meta: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalRecords: total,
          },
        },
      };
    } catch (error) {
      console.error("Error fetching blogs:", error);
      throw new BadRequestException(
        "Failed to fetch blogs. Please try again later."
      );
    }
  }

  async findOne(slug: string) {
    const blog = await this.blogModel.findOne({ slug });

    if (!blog) {
      throw new BadRequestException("Blog not found");
    }

    return {
      data: blog,
    };
  }

  update(id: number, updateBlogDto: UpdateBlogDto) {
    return `This action updates a #${id} blog`;
  }

  async remove(id: string) {
    const blog = await this.blogModel.findByIdAndDelete(id);

    if (!blog) {
      throw new BadRequestException("Blog not found");
    }

    return blog;
  }
}
