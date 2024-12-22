import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

import { AuthMessage } from "./constants/auth-message.enum";
import { TokenTypes } from "./constants/token.constant";
import { LoginDto } from "./dto/login.dto";
import { TokensService } from "./token.service";
import * as bcrypt from "bcrypt";
import { PaginateModel } from "mongoose";
import { AUTHS_MODEL, AuthsDocument } from "./schemas/auths.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Role } from "common/constants/Role";
import { QueryParamsGetUser, UpdateActiveUserDto, UpdateGamesDto, UpdateNoteDto } from "./dto/update.dto";
import { DeleteDto } from "./dto/delete.dto";

@Injectable()
export class AuthAdminService {
  constructor(
    @InjectModel(AUTHS_MODEL)
    private readonly authsModel: PaginateModel<AuthsDocument>,
    private readonly tokenService: TokensService,
  ) {}

  async logInAdmin(loginDto: LoginDto): Promise<any> {
    const { phone, password } = loginDto;

    const user = await this.authsModel.findOne({
      phone,
    });

    if (!user) {
      throw new BadRequestException(AuthMessage.NOT_FOUND);
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new BadRequestException(AuthMessage.NOT_FOUND);
    }

    if (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN) {
      throw new BadRequestException(AuthMessage.NOT_ACCESS);
    }

    // await this.tokenService.deleteManyTokens(user._id);
    const tokens = await this.tokenService.generateAuthTokens(user);

    return {
      data: {
        user: {
          _id: user._id,
          phone: user.phone,
          name: user.name,
          role: user.role,
        },
        tokens,
      },
    };
  }

  async logOut(refreshToken: string) {
    await this.tokenService.findAndRemoveRefreshToken(refreshToken);

    return {
      message: AuthMessage.LOGGED_OUT,
    };
  }

  async refreshToken(refreshToken: string) {
    const refreshTokenDoc = await this.tokenService.findAndRemoveRefreshToken(
      refreshToken
    );
    const userDoc = (await this.authsModel.findById(
      refreshTokenDoc.user
    )) as AuthsDocument;
    const newTokens = await this.tokenService.generateAuthTokens(userDoc);

    return {
      user: userDoc.id,
      tokens: newTokens,
    };
  }

  async getAllUser(userInfo: AuthsDocument, queryParams: QueryParamsGetUser) {
    console.log('queryParams', queryParams)
    if (queryParams.keyword === undefined) {
      queryParams.keyword = "";
    }
    const users = await this.authsModel.find({ role: Role.USER, $or: [{ name: { $regex: queryParams.keyword, $options: "i" } }, { phone: { $regex: queryParams.keyword, $options: "i" } }]});

    console.log('user', users)

    const data = users.map((user: any) => {
      return {
        _id: user._id,
        phone: userInfo.role == Role.SUPER_ADMIN ? user.phone : user.phone.split("").map((_, i) => (i > 5 && i < 10 ? "*" : _)).join(""), // Hide phone number
        name: user.name,
        role: user.role,
        active: user.active,
        note: user.note,
        games: user.games,
        createdAt: user.createdAt,
      };
    })

    return {
      data: data,
    };
  }

  async getAllExportExcel(): Promise<any> {
    const users = await this.authsModel.find({ role: Role.USER });

    return {
      data: users,
    };
  }

  async updateNoteUser(updateNoteDto: UpdateNoteDto) {
    const { userId, note } = updateNoteDto;
    const user = await this.authsModel.findById(userId);

    if (!user) {
      throw new BadRequestException(AuthMessage.NOT_FOUND);
    }

    user.note = note;
    await user.save();

    return {
      message: AuthMessage.UPDATE_SUCCESS,
    };
  }

  async updateActiveUser(updateActiveUserDto: UpdateActiveUserDto) {
    const { userId, active } = updateActiveUserDto;
    const user = await this.authsModel.findById(userId);

    if (!user) {
      throw new BadRequestException(AuthMessage.NOT_FOUND);
    }

    user.active = active;
    await user.save();

    return {
      message: AuthMessage.UPDATE_SUCCESS,
    };
  }

  async updateGamesUser(updateGamesDto: UpdateGamesDto) {
    const { userId, games } = updateGamesDto;
    const user = await this.authsModel.findById(userId);

    if (!user) {
      throw new BadRequestException(AuthMessage.NOT_FOUND);
    }

    user.games = games;
    await user.save();

    return {
      message: AuthMessage.UPDATE_SUCCESS,
    };
  }

  async deleteUser(userId: DeleteDto) {
    const user = await this.authsModel.findById(userId.userId);

    if (!user) {
      throw new BadRequestException(AuthMessage.NOT_FOUND);
    }

    await this.authsModel.findByIdAndDelete(userId.userId);

    return {
      message: AuthMessage.DELETE_SUCCESS,
    };
  }
}
