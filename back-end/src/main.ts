import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import 'reflect-metadata';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global Exception Filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger
  if (process.env['NODE_ENV'] !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Teddy Open Finance API')
      .setDescription('API do desafio técnico Teddy Open Finance')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = process.env['PORT'] ?? 3000;
  await app.listen(port);

  console.log(`🚀 API running on: http://localhost:${port}/api/v1`);
  console.log(`📄 Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap().catch(console.error);
