import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateRoomDto } from "./dto/create-room.dto";
import { UpdateRoomDto } from "./dto/update-room.dto";
import { InjectModel } from "@nestjs/mongoose";
import { ROOMS_MODEL, RoomsDocument } from "./schemas/rooms.schema";
import { PaginateModel } from "mongoose";
import { PRODUCTS_MODEL, ProductsDocument } from "./schemas/products.schema";
import axios from "axios";
import * as cheerio from "cheerio";

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(ROOMS_MODEL)
    private readonly roomModel: PaginateModel<RoomsDocument>,

    @InjectModel(PRODUCTS_MODEL)
    private readonly productsModel: PaginateModel<ProductsDocument>
  ) {}

  async create(createRoomDto: CreateRoomDto) {
    const { items, type } = createRoomDto;

    for (const item of items) {
      // create room
      const newRoom = await this.roomModel.create({
        id: item.id,
        altText: item.altText,
        type: type,
        url: item.url,
        index: item.index,
      });

      for (const product of item.products) {
        // create product
        await this.productsModel.create({
          room_id: newRoom.id,
          id: product.id,
          index: product.index,
          tagPosition: product.tagPosition,
          dotCoordinates: product.dotCoordinates,
        });
      }
    }

    return {
      message: "Create room successfully !",
    };
  }

  async findAll(page = 1, limit = 10, type: string = "all") {
    try {
      const skip = (page - 1) * limit;

      const matchStage = type === "all" ? {} : { type };

      const [rooms, total] = await Promise.all([
        this.roomModel
          .aggregate([
            { $match: matchStage },
            { $skip: skip },
            { $limit: limit },
            {
              $lookup: {
                from: "products", // Tên của collection chứa products
                localField: "id", // Trường trong rooms để join
                foreignField: "room_id", // Trường trong products để join
                as: "products", // Tên của mảng kết quả chứa các sản phẩm
              },
            },
          ])
          .sort({ createdAt: 1 })
          .exec(),
        this.roomModel.countDocuments(matchStage).exec(),
      ]);

      return {
        data: {
          data: rooms,
          meta: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalRecords: total,
          },
        },
      };
    } catch (error) {
      console.error("Error fetching rooms:", error);
      throw new BadRequestException(
        "Failed to fetch rooms. Please try again later."
      );
    }
  }

  async getProductPrice(id: string) {
    try {
      const lastThreeDigits = id.slice(-3);
      const html = await axios.get(
        `https://www.ikea.com/sg/en/products/${lastThreeDigits}/${id}-shoppable-fragment.html`
      );

      const $ = cheerio.load(html.data);

      const productName = $(".pip-header-section__title--small").text().trim();
      const description = $(".pip-header-section__description-text")
        .text()
        .trim();
      const price = $(".pip-price__integer").text().trim();
      const currency = $(".pip-price__currency").text().trim();
      const productUrl = $(".pip-shoppable-price-package__link").attr("href");

      return {
        data: {
          productName,
          description,
          currency,
          price,
          productUrl,
        },
      };
    } catch (error) {
      console.error("Error fetching product price:", error);
      throw new BadRequestException(
        "Failed to fetch product price. Please try again later."
      );
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} room`;
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    return `This action updates a #${id} room`;
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
}
