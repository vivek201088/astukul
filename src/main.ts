import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { CustomValidationPipe } from './validations/custom-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global response interceptor (for success responses)
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Global exception filter (for error responses)
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Global validation pipe with custom error formatting
  app.useGlobalPipes(new CustomValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
    disableErrorMessages: false,
  }));


  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true, // optional (if using cookies/auth headers)
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
