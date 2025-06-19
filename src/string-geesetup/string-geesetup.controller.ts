import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateStringGeesetupDto } from './dto/create-string-geesetup.dto';
import { UpdateStringGeesetupDto } from './dto/update-string-geesetup.dto';
import { StringGeesetupService } from './string-geesetup.service';

@Controller('string-geesetup')
  export class StringGeesetupController {
    constructor(private readonly stringGeesetupService: StringGeesetupService) {}
  
    @Get('init')
    async init() {
      const restToken = await this.stringGeesetupService.setRestToken();
      return { restToken };
    }
  // tạo phòng
    @Post('create-room')
    async createRoom(@Body() createStringGeesetupDto: CreateStringGeesetupDto) {
      const room = await this.stringGeesetupService.createRoom(createStringGeesetupDto);
      return room;
    }
  // lấy user token
    @Get('user-token/:userId')
    async getUserToken(@Param('userId') userId: string) {
      const userToken = await this.stringGeesetupService.getUserToken(userId);
      return { userToken };
    }
  // lấy room token
    @Get('room-token/:roomId')
    async getRoomToken(@Param('roomId') roomId: string) {
      const roomToken = await this.stringGeesetupService.getRoomToken(roomId);
      return { roomToken };
    }
  }
