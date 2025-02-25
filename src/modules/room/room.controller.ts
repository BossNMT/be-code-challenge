import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Room')
@Controller('api/room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post('create')
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }

  @Get('get-all')
  findAll(@Query('page') page?: number, @Query('limit') limit?: number, @Query('type') type?: string) {
    return this.roomService.findAll(page, limit, type);
  }

  @Get('product-price/:id')
  findOne(@Param('id') id: string) {
    return this.roomService.getProductPrice(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomService.update(+id, updateRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomService.remove(+id);
  }
}
