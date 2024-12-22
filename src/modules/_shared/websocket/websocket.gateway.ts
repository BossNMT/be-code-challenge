import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
} from "@nestjs/websockets";
import { WebsocketService } from "./websocket.service";
import {
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { Socket } from "socket.io";
import { Server } from "socket.io";

@WebSocketGateway()
@UsePipes(new ValidationPipe())
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly websocketService: WebsocketService) {}

  @WebSocketServer() server: Server;

  async handleConnection(client: Socket) {
    // this.websocketService.checkConnectAndRequest(client);
  }

  handleDisconnect(client: any) {
    // Xử lý khi một kết nối bị đóng
  }
}
