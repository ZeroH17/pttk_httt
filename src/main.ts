import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*', // hoặc ['http://localhost:3000'] nếu frontend cụ thể
    credentials: true,
  });

  app.useBodyParser('json'); // hoặc có thể bỏ luôn vì Nest tự bật rồi

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server chạy tại http://localhost:${port}`);
}
bootstrap();
