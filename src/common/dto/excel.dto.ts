import { IsOptional } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class ExcelDto {
  @ApiProperty()
  @IsOptional()
  readonly isExcel?: boolean;
}
