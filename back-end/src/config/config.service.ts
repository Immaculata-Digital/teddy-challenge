import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private readonly config: NestConfigService) {}

  get(key: string): string {
    const value = this.config.get<string>(key);
    if (value === undefined || value === null) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
  }

  getOptional(key: string, defaultValue = ''): string {
    return this.config.get<string>(key) ?? defaultValue;
  }

  getNumber(key: string): number {
    return parseInt(this.get(key), 10);
  }

  getBoolean(key: string): boolean {
    return this.get(key) === 'true';
  }
}
