import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
// import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global exception filter - temporarily commented out
  // app.useGlobalFilters(new GlobalExceptionFilter());

  // Global validation pipe - temporarily commented out
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     forbidNonWhitelisted: true,
  //     transform: true,
  //     transformOptions: {
  //       enableImplicitConversion: true,
  //     },
  //   }),
  // );

  // CORS configuration
  app.enableCors({
    origin: ['http://localhost:3002', 'http://localhost:3000'], // Allow specific origins
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Range'],
    exposedHeaders: ['Content-Range', 'Accept-Ranges', 'Content-Length'],
  });

  // Swagger documentation - temporarily commented out
  // const config = new DocumentBuilder()
  //   .setTitle('LMS Platform API')
  //   .setDescription('Modern Learning Management System API')
  //   .setVersion('1.0')
  //   .addBearerAuth()
  //   .addTag('Authentication', 'User authentication and authorization')
  //   .addTag('Users', 'User management operations')
  //   .addTag('Devices', 'Device management and enrollment')
  //   .addTag('Courses', 'Course management operations')
  //   .addTag('Lessons', 'Lesson and content management')
  //   .addTag('Orders', 'Order and payment management')
  //   .build();

  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api', app, document);

  // Global prefix - temporarily commented out for debugging
  // app.setGlobalPrefix('api/v1');

  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`🚀 LMS Platform API running on port ${port}`);
  // console.log(`📚 Swagger documentation: http://localhost:${port}/api`);
}
bootstrap();
