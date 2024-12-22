// auth.middleware.ts

import { ArgumentMetadata, Injectable, NestMiddleware, PipeTransform } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { TokenTypes } from "modules/auth/constants/token.constant";
import { TokensService } from "modules/auth/token.service";
import { Socket } from "socket.io";

@Injectable()
export class WebsocketMiddleware implements PipeTransform {
  constructor(
    private readonly tokenService: TokensService,
  ) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    const client: Socket = value;

    try {
      if (!client.handshake.headers.authorization) {
        throw new WsException("Unauthorized: Missing Authorization Header");
      }

      const accessToken = client.handshake.headers.authorization.split(" ")[1];
      
      if (!accessToken) {
        throw new WsException("Unauthorized: Invalid Token");
      }

      const decodedToken: any = await this.tokenService.verifyToken(
        accessToken,
        TokenTypes.ACCESS
      );

      if (!decodedToken) {
        throw new WsException("Unauthorized: Invalid or expired token");
      }

      // Nếu xác thực thành công, tiếp tục kết nối
      return value;
    } catch (error) {
      // Log lỗi nếu cần thiết
      throw new WsException("Unauthorized: Invalid Token");
    }
  }
}
