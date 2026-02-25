import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@al-jns/database';

@Injectable()
export class AppService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  getHello(): string {
    return 'Hello World!';
  }
}
