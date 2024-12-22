import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";
import config from "common/config";

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  public async setKey(key: string, data: string, ttl: number): Promise<void> {
    try {
      return await this.cacheManager.set(key, data, ttl);
    } catch (error) {
      console.log(error);
    }
  }

  public getKey(key: string): Promise<string | undefined> {
    return this.cacheManager.get(key);
  }

  public async getAllKeys(type: string): Promise<any> {
    //Get all keys
    const keys = await this.cacheManager.store.keys();
    //Loop through keys and get data
    const allData: any = [];
    for (const key of keys) {
      const keySplit = key.split(`${config.redisConfig.prefix}`)[1]
      const item: string | undefined = await this.cacheManager.get(keySplit);
      if (item) {
        const data = JSON.parse(item);
        if (data.type === type) {
          allData.push(data);
        }
      }
    }

    return allData;
  }

  public removeKey(key: string): Promise<any> {
    return this.cacheManager.del(key);
  }

  public resetAll(): Promise<any> {
    return this.cacheManager.reset();
  }
}
