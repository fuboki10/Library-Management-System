import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerFactory } from './utils/LoggerFactory';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: LoggerFactory('LibrarySystem'),
  });

  const PORT = process.env.PORT || 3000;
  const HOST = process.env.HOST || '127.0.0.1';

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(PORT, HOST);

  Logger.log(`Application is running on: ${await app.getUrl()} 🚀`);
  Logger.log(`Swagger is running on: ${await app.getUrl()}/docs 📚`);
}
bootstrap();
