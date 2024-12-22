import { HttpModule } from "@nestjs/axios";
import { Global, Module } from "@nestjs/common";

import { CacheService } from "./services/cache.service";
import { WebsocketModule } from './websocket/websocket.module';
import { ExcelService } from "./services/export-excel.service";

const providers = [CacheService, ExcelService];
const modules = [HttpModule, WebsocketModule];

@Global()
@Module({
  providers,
  imports: modules,
  exports: [...providers, ...modules],
})
export class SharedModule {}
