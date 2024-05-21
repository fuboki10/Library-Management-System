import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerFactory } from './utils/LoggerFactory';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { loggers } from 'winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: LoggerFactory('LibrarySystem'),
  });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);

  Logger.log(`Application is running on: ${await app.getUrl()} 🚀`);
  Logger.log(`Swagger is running on: ${await app.getUrl()}/docs 📚`);
}
bootstrap();
