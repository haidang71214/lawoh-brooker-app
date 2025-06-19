import { Server } from 'socket.io';
import { INestApplication } from '@nestjs/common';
import { ChatService } from 'src/message/message.service';
// lấy cái chat service vô mà xử lí

export function setupSocketIo(app: INestApplication, chatService: ChatService) {
  const server = app.getHttpServer();
  const io = new Server(server, { cors: { origin: '*' } });

  io.on('connection', socket => {
    console.log('Client connected:', socket.id);

    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    socket.on('sendMessage', async ({ conversationId, senderId, content }) => {
      const message = await chatService.addMessage(conversationId, senderId, content);
      io.to(conversationId).emit('newMessage', message);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  // mỗi lần join 1 video là join 1 cái room với id chính là cái video đó
  // mỗi lần out là disconnent
  // on là send comment 
  
  });
  // làm thêm 1 cái comment
  // mỗi lần block vô 
}
