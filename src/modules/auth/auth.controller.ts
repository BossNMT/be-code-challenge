import { Body, Controller, Get, Param, Patch, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { LogOutDto, RefreshTokenDto } from "./dto/refresh-token.dto";
import { RegisterDto } from "./dto/register.dto";
import { AuthUser } from "common/decorators/http.decorators";
import { User } from "common/decorators/user.decorator";
import { AuthsDocument } from "./schemas/auths.schema";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: "Login user" })
  async logIn(@Body() logInDto: LoginDto) {
    return this.authService.logIn(logInDto);
  }

  @Post("register")
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: "Register user" })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post("logout")
  @ApiOperation({ summary: "Log out and remove refresh token" })
  async logOut(@Body() logOutDto: LogOutDto) {
    return this.authService.logOut(logOutDto.refreshToken);
  }

  @Post("refresh-tokens")
  @ApiOperation({ summary: "get a new access and refresh token" })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @AuthUser()
  @Get("me")
  @ApiOperation({ summary: "Get current user" })
  async me(@User() user: AuthsDocument) {
    console.log('user', user)
    return await this.authService.findUserById(user._id);
  }
}
