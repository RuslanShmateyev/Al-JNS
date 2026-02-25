import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class AppService implements OnModuleInit {
  constructor() { }

  async onModuleInit() {
    // Initialization logic if any
  }

  getHello(): string {
    return 'Hello World!';
  }
}
