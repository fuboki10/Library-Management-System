import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerFactory } from './utils/LoggerFactory';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { QueryFailedExceptionFilter } from './prisma/prisma.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: LoggerFactory('LibrarySystem'),
  });

  app.enableCors({ origin: true, credentials: true });
  const globalPrefix = 'api';

  /** Set Global filters */
  app.useGlobalFilters(new QueryFailedExceptionFilter());

  /** Set prefices for app url */
  app.setGlobalPrefix(globalPrefix);

  /** Add Versioning for the app */
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Library Management System API')
    .setDescription('The Library Management System API description')
    .setVersion('1.0')
    .addSecurity('basic', {
      type: 'http',
      scheme: 'basic',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const PORT = process.env.PORT || 3000;
  const HOST = process.env.HOST || '127.0.0.1';

  await app.listen(PORT, HOST);

  Logger.log(`Application is running on: ${await app.getUrl()} 🚀`);
  Logger.log(`Swagger is running on: ${await app.getUrl()}/docs 📚`);
}
bootstrap();
