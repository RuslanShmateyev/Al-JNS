import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://46.224.211.7:8080',
      'http://46.224.211.7:80',
      'http://46.224.211.7',
      'http://localhost:5173',
      'http://localhost:3000',
    ],
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
