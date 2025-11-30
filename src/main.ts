import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ApiExceptionFilter } from './common/filters/api-exception.filter';
import { MongoExceptionFilter } from './common/filters/mongo-exception.filter';
import { SuccessInterceptor } from './common/interceptors/success.interceptor';
import { validationExceptionFactory } from './common/pipes/validation-exception.factory';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [/^https:\/\/.*\.github\.dev$/], methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
  });

  // ✅ Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: validationExceptionFactory,
    }),
  );

  // Exception Filters
  app.useGlobalFilters(
    new MongoExceptionFilter(),     // duplicate key
    new ApiExceptionFilter()        // all other errors
  );

  // Success Interceptor
  app.useGlobalInterceptors(new SuccessInterceptor());
  //  Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Ecommerce API')
    .setDescription('API documentation for your Ecommerce backend')
    .setVersion('1.0')
    .addTag('ecommerce')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document, {
    customCssUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.1/swagger-ui.min.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.1/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.1/swagger-ui-standalone-preset.min.js',
    ],
  });
  // ✅ Start server
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}`);
}

bootstrap();
