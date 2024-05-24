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
      transformOptions: { strategy: 'excludeAll' },
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
  SwaggerModule.setup('docs', app, document, {
    customCss:
      '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
    customCssUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js',
    ],
  });

  const PORT = process.env.PORT || 3000;
  const HOST = process.env.HOST || '127.0.0.1';

  await app.listen(PORT, HOST);

  Logger.log(`Application is running on: ${await app.getUrl()} 🚀`);
  Logger.log(`Swagger is running on: ${await app.getUrl()}/docs 📚`);
}
bootstrap();
