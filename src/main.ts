import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import { config } from 'dotenv';
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors());
  app.use(express.json ? express.json() : (req,res,next)=>next()); // safe
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Server chạy tại http://localhost:${port}`);
}
bootstrap();
