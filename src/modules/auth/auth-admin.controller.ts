import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { LoginDto } from "./dto/login.dto";
import { LogOutDto, RefreshTokenDto } from "./dto/refresh-token.dto";
import { AuthAdminService } from "./auth-admin.service";
import {
  Auth,
  AuthAdmin,
  AuthAdminAndSuperAuthAdmin,
  SuperAuthAdmin,
} from "common/decorators/http.decorators";
import {
  QueryParamsGetUser,
  UpdateActiveUserDto,
  UpdateGamesDto,
  UpdateNoteDto,
} from "./dto/update.dto";
import { DeleteDto } from "./dto/delete.dto";
import { User } from "common/decorators/user.decorator";
import { AuthsDocument } from "./schemas/auths.schema";
import { ExcelService } from "modules/_shared/services/export-excel.service";
import { Response } from "express";

@ApiTags("Auth Admin")
@Controller("auth-admin")
export class AuthAdminController {
  constructor(
    private readonly authAdminService: AuthAdminService,
    private readonly excelService: ExcelService
  ) {}

  @Post("login-admin")
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: "Login admin" })
  async logInAdmin(@Body() logInDto: LoginDto) {
    return this.authAdminService.logInAdmin(logInDto);
  }

  @Post("logout")
  @ApiOperation({ summary: "Log out and remove refresh token" })
  async logOut(@Body() logOutDto: LogOutDto) {
    return this.authAdminService.logOut(logOutDto.refreshToken);
  }

  @Post("refresh-tokens")
  @ApiOperation({ summary: "get a new access and refresh token" })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authAdminService.refreshToken(refreshTokenDto.refreshToken);
  }

  @AuthAdminAndSuperAuthAdmin()
  @Get("get-all-user")
  @ApiOperation({ summary: "Get all user" })
  async getAllUserDriver(@User() user: AuthsDocument, @Query() queryParams: QueryParamsGetUser) {
    return this.authAdminService.getAllUser(user, queryParams);
  }

  // @SuperAuthAdmin()
  @Get("export-user")
  @ApiOperation({ summary: "Export user" })
  async exportUser(@Res() res: Response) {
    try {
      const data = await this.authAdminService.getAllExportExcel();
      const filePath = await this.excelService.exportToExcel(
        data.data,
        "List-User"
      );
      console.log('filePath', filePath)
      res.download(filePath, `List-User.xlsx`, async () => {
        // Xóa tệp sau khi đã được tải xuống
        await this.excelService.deleteFile(filePath);
      });
    } catch (error) {
      console.log(error)
    }
  }

  @AuthAdminAndSuperAuthAdmin()
  @Post("note-user")
  @ApiOperation({ summary: "Note user" })
  @UsePipes(ValidationPipe)
  async noteUser(@Body() noteUserDto: UpdateNoteDto) {
    return this.authAdminService.updateNoteUser(noteUserDto);
  }

  @AuthAdminAndSuperAuthAdmin()
  @Post("active-user")
  @ApiOperation({ summary: "Active user" })
  @UsePipes(ValidationPipe)
  async activeUser(@Body() activeUserDto: UpdateActiveUserDto) {
    return this.authAdminService.updateActiveUser(activeUserDto);
  }

  @AuthAdminAndSuperAuthAdmin()
  @Post("update-games")
  @ApiOperation({ summary: "Update games" })
  @UsePipes(ValidationPipe)
  async updateGames(@Body() updateGamesDto: UpdateGamesDto) {
    return this.authAdminService.updateGamesUser(updateGamesDto);
  }

  @SuperAuthAdmin()
  @Post("delete-user")
  @ApiOperation({ summary: "Delete user" })
  @UsePipes(ValidationPipe)
  async deleteUser(@Body() deleteUserDto: DeleteDto) {
    return this.authAdminService.deleteUser(deleteUserDto);
  }

  // @AuthAdmin()
  // @Post("create-user-driver")
  // @ApiOperation({ summary: "Create user driver" })
  // @UsePipes(ValidationPipe)
  // async createUserDriver(@Body() createUserDriverDto: createUserDriverDto) {
  //   return this.authAdminService.createUserDriver(createUserDriverDto);
  // }

  // @AuthAdmin()
  // @Patch("update-user-driver/:id")
  // @ApiOperation({ summary: "Update user driver" })
  // @UsePipes(ValidationPipe)
  // async updateUserDriver(@Param('id') id: string, @Body() updateUserDriverDto: UpdateUserDriverDto) {
  //   return this.authAdminService.updateUserDriver(id, updateUserDriverDto);
  // }
}
