import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService);

  const fcmConfig = configService.get('fcm');
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: fcmConfig.projectId,
      privateKey: fcmConfig.privateKey,
      clientEmail: fcmConfig.clientEmail,
    }),
  });

  app.use((req, res, next) => {
    res.header('Content-Type', 'application/json; charset=utf-8');
    next();
  });

  const config = new DocumentBuilder()
    .setTitle('Walashee API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (_: string, methodKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(app, config, options);

  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: true,
    credentials: true,
  })

  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
}
bootstrap();
