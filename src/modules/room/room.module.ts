import { Module } from "@nestjs/common";
import { RoomService } from "./room.service";
import { RoomController } from "./room.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { ROOMS_MODEL, RoomsSchema } from "./schemas/rooms.schema";
import { PRODUCTS_MODEL, ProductsSchema } from "./schemas/products.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ROOMS_MODEL, schema: RoomsSchema },
      { name: PRODUCTS_MODEL, schema: ProductsSchema },
    ]),
  ],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
