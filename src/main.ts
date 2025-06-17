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
      origin: ['http://localhost:3000', process.env.NODE_ENV === 'production' ? 'https://lawohbe.onrender.com' : '*'],
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

    // Lấy cổng từ process.env.PORT (Render) hoặc ConfigService
    const port = process.env.PORT || configService.get<number>('PORT') || 8080;

    // Khởi tạo và setup Socket.io
    const chatService = app.get(ChatService);
    const commentService = app.get(CommentService);
    setupSocketIo(app, chatService, commentService);

    // Khởi động ứng dụng
    await app.listen(port);
    console.log(`Ứng dụng đang chạy trên: http://localhost:${port}`);
    console.log(`MongoDB URI: ${configService.get<string>('MONGODB_URI')}`);
  } catch (error) {
    console.error('Ứng dụng không khởi động được:', error.stack); // Log chi tiết lỗi
    process.exit(1); // Thoát với mã lỗi để Render nhận biết
  }
}

bootstrap();