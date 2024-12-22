import { IsBoolean, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class DeleteDto {
  @ApiProperty()
  @IsString()
  userId: string;
}