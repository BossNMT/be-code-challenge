import redisStore from "cache-manager-redis-store";
import { Network } from "common/enums/network.enum";
import config from "config";
import { isNil } from "lodash";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import mongoosePaginate from "mongoose-paginate-v2";

import { CacheModuleOptions } from "@nestjs/common";
import { MongooseModuleOptions } from "@nestjs/mongoose";

class Config {
  get nodeEnv(): string {
    return this.getString("node_env");
  }

  get cron() {
    const isDisableCron = Boolean(JSON.parse(process.env.DISABLE_CRON || "false"));
    return this.getBoolean("cron") && !isDisableCron;
  }

  get port() {
    return this.getNumber("server.port");
  }

  get host() {
    return this.getString("server.host");
  }

  get isDevelopment() {
    return this.nodeEnv === "development";
  }

  get mongoose(): { uri: string; options: MongooseModuleOptions } {
    return {
      uri: this.getString("mongodb.uri"),
      options: {
        directConnection: true,
        connectionFactory: (connection) => {
          connection.plugin(mongoosePaginate);
          connection.plugin(aggregatePaginate);
          return connection;
        },
      },
    };
  }

  get swagger() {
    return {
      name: this.getString("swagger.name"),
      description: this.getString("swagger.description"),
      doc_url: this.getString("swagger.doc_url"),
      version: this.getString("swagger.version"),
      is_auth: this.getBoolean("swagger.is_auth"),
      username: this.getString("swagger.username"),
      password: this.getString("swagger.password"),
    };
  }

  get redisConfig(): CacheModuleOptions {
    return {
      isGlobal: true,
      store: redisStore,
      url: this.getString("redis.uri"),
      prefix: `${this.getString("redis.prefix")}_${this.nodeEnv}_`,
      ttl: 120,
    };
  }

  get smsConfig() {
    return {
      hostname: this.getString("sms.hostname"),
      key: this.getString("sms.key"),
    }
  }

  get configApp() {
    return {
      radius: this.getNumber("config_app.radius"),
      key_sms: this.getString("config_app.key_sms"),
    }
  }

  get accountAdmin() {
    return {
      phone: this.getString("account_admin.phone"),
      password: this.getString("account_admin.password"),
    }
  }

  get accountSuperAdmin() {
    return {
      phone: this.getString("account_super_admin.phone"),
      password: this.getString("account_super_admin.password"),
    }
  }

  get fallbackLanguage(): string {
    return this.getString("i18n.fallback_language");
  }

  get jwt() {
    return {
      secret: this.getString("jwt.secret"),
      accessExpirationMinutes: this.getNumber("jwt.access_expiration_minutes"),
      refreshExpirationDays: this.getNumber("jwt.refresh_expiration_days"),
    };
  }

  // ethereum config
  get numberBlockResync() {
    return 10;
  }

  get blockPerSync() {
    return 2000 - this.numberBlockResync;
  }

  private getString(key: string): string {
    const value = config.get<string>(key);
    if (isNil(value)) {
      throw new Error(key + " environment variable does not set");
    }

    return value.toString().replace(/\\n/g, "\n");
  }

  private getNumber(key: string): number {
    const value = this.getString(key);
    try {
      return Number(value);
    } catch {
      throw new Error(key + " environment variable is not a number");
    }
  }

  private getBoolean(key: string): boolean {
    const value = this.getString(key);
    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + " env var is not a boolean");
    }
  }
}

export default new Config();
