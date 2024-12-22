import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { UploadService } from "./upload.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { AuthUser } from "common/decorators/http.decorators";

@ApiTags("upload")
@Controller("api/upload")
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @AuthUser()
  @Post("image")
  @ApiOperation({ summary: "Upload image" })
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads/images", // thư mục lưu trữ file
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join("");
          cb(null, `${randomName}${extname(file.originalname)}`); // tên file ngẫu nhiên
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 5, // giới hạn kích thước file (5MB)
      },
    })
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return {
      statusCode: 200,
      message: "Success",
      data: {
        filename: file.filename,
      },
    };
  }

  @AuthUser()
  @Post('video')
  @ApiOperation({ summary: "Upload video" })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/videos',  // thư mục lưu trữ video
      filename: (req, file, cb) => {
        const randomName = Array(32)
          .fill(null)
          .map(() => Math.round(Math.random() * 16).toString(16))
          .join('');
        cb(null, `${randomName}${extname(file.originalname)}`);  // tên file ngẫu nhiên
      },
    }),
    limits: {
      fileSize: 1024 * 1024 * 100,  // giới hạn kích thước file video (100MB)
    },
    fileFilter: (req, file, cb) => {
      // Chỉ cho phép các định dạng video
      if (!file.originalname.match(/\.(mp4|mkv|avi|mov|MP4|MKV|AVI|MOV)$/)) {
        return cb(new Error('Only video files are allowed!'), false);
      }
      cb(null, true);
    }
  }))
  uploadVideo(@UploadedFile() file: Express.Multer.File) {
    return {
      statusCode: 200,
      message: "Success",
      data: {
        filename: file.filename,
      },
    };
  }
}
