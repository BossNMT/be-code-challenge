import { Injectable } from "@nestjs/common";
import { CacheService } from "../services/cache.service";
import { Socket } from "socket.io";
import { TokensService } from "modules/auth/token.service";
import { TokenTypes } from "modules/auth/constants/token.constant";
@Injectable()
export class WebsocketService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly tokenService: TokensService,
  ) {}

  async checkConnectAndRequest(client: Socket) {
    try {
      if (!client.handshake.headers.authorization) {
        client.disconnect();
        return;
      }

      const accessToken = client.handshake.headers.authorization.split(" ")[1];

      if (!accessToken) {
        client.disconnect();
        return;
      }

      const decodedToken: any = await this.tokenService.verifyToken(
        accessToken,
        TokenTypes.ACCESS
      );

      if (!decodedToken) {
        client.disconnect();
        return;
      }

      return decodedToken;
    } catch (error) {
      // Log lỗi nếu cần thiết
      client.disconnect();
      return null;
    }
  }
}
