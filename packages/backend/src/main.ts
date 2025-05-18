import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import { join } from 'path';
import * as fs from 'fs';
import * as path from 'path';
import { setupSwagger } from './shared/configs/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  setupSwagger(app); // Swagger setup in config file

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const publicPath = join(__dirname, '..', 'public');
  if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath);
  }

  const indexPath = path.join(publicPath, 'index.html');
  if (!fs.existsSync(indexPath)) {
    fs.writeFileSync(
      indexPath,
      '<html><body><h1>Welcome to GiraIjambo!</h1></body></html>',
    );
  }

  await app.listen(port);

  console.info('===========================================')
  console.info(`Server is running on port ${port}`)
  console.info('===========================================')
}
bootstrap();