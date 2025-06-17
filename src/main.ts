import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { setupSocketIo } from './config/socket-io';
import { ChatService } from './message/message.service';
import { CommentService } from './comment/comment.service';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // Cấu hình global pipes
    app.useGlobalPipes(new ValidationPipe());

    // Cấu hình CORS
    app.enableCors({
      origin: ['http://localhost:3000', process.env.NODE_ENV === 'production' ? 'https://yourdomain.com' : '*'],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });

    // Cấu hình Swagger
    const configSwagger = new DocumentBuilder()
      .setTitle('API LAWOH')
      .setDescription('LAWOH API LIST')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const swagger = SwaggerModule.createDocument(app, configSwagger);
    SwaggerModule.setup('Swagger', app, swagger);

    // Lấy port từ process.env.PORT (Render) hoặc ConfigService
    const port = process.env.PORT || configService.get<number>('PORT') || 8080;

    // Khởi tạo và setup Socket.io
    const chatService = app.get(ChatService);
    const commentService = app.get(CommentService);
    setupSocketIo(app, chatService, commentService);

    // Khởi động ứng dụng trên 0.0.0.0
    await app.listen(port, '0.0.0.0');
    // render đẩy lên 0 0 0 0 á
    console.log(`Ứng dụng đang chạy trên port: http://0.0.0.0:${port}`);
  } catch (error) {
    console.error('Ứng dụng không khởi động được:', error.stack);
    process.exit(1);
  }
}

bootstrap();