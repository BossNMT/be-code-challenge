import config from "common/config";
import { I18nAllExceptionFilter } from "common/filters/i18n-all-exception.filter";
import { SharedModule } from "modules/_shared/shared.module";
import { AuthModule } from "modules/auth/auth.module";
import { AcceptLanguageResolver, I18nModule, QueryResolver } from "nestjs-i18n";
import { join } from "path";

import { Module } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule";
import { ResponseInterceptor } from "common/interceptors/response.interceptor";
import { CacheModule } from "@nestjs/cache-manager";
import { SeederModule } from "modules/seeder/seeder.module";
import { JobsModule } from "modules/_jobs/jobs.module";
import { BlogModule } from "modules/blog/blog.module";
import { UploadModule } from "modules/upload/upload.module";
import { ServeStaticModule } from "@nestjs/serve-static";

@Module({
  imports: [
    // global module
    ...(config.cron ? [ScheduleModule.forRoot()] : []),
    MongooseModule.forRoot(config.mongoose.uri),
    // CacheModule.register({ isGlobal: true }),
    CacheModule.register(config.redisConfig),
    I18nModule.forRoot({
      fallbackLanguage: config.fallbackLanguage,
      loaderOptions: {
        path: join(__dirname, "/i18n/"),
        watch: config.isDevelopment,
      },
      resolvers: [
        { use: QueryResolver, options: ["lang"] },
        AcceptLanguageResolver,
      ],
    }),
    SharedModule,
    // Static file
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "uploads"), // Đường dẫn tới thư mục chứa ảnh
      serveRoot: "/uploads", // Định nghĩa đường dẫn URL mà bạn có thể truy cập ảnh
    }),
    // jobs module
    JobsModule,
    // app modules
    AuthModule,
    SeederModule,
    // TODO
    BlogModule,
    UploadModule,
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    { provide: APP_FILTER, useClass: I18nAllExceptionFilter },
  ],
})
export class AppModule {}
