import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Configurar CORS
  app.enableCors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        'http://localhost:3000',
        process.env.FRONTEND_URL,
      ].filter(Boolean);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Permitir cookies y credenciales
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
    exposedHeaders: ['Set-Cookie'],
    optionsSuccessStatus: 200,
  });

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('Project Manager API')
    .setDescription('API para gestión de proyectos y tareas')
    .setVersion('1.0')
    .addTag('tasks', 'Operaciones relacionadas con tareas')
    .addTag('projects', 'Operaciones relacionadas con proyectos')
    .addTag('users', 'Operaciones relacionadas con usuarios')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT ?? 4000);
  console.log(
    `Aplicación corriendo en: http://localhost:${process.env.PORT ?? 4000}`,
  );
  console.log(
    `Documentación Swagger en: http://localhost:${process.env.PORT ?? 4000}/api`,
  );
}
void bootstrap();
