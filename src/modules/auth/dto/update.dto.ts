import { IsArray, IsBoolean, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateNoteDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  note: string;
}

export class UpdateActiveUserDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsBoolean()
  active: boolean;
}

export class UpdateGamesDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsArray()
  games: string[];
}

export class QueryParamsGetUser {
  keyword?: string;
}