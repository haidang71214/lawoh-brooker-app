import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Response } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/stratergy/jwt.guard';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}


// những option cho booking: booking trên 1 tháng -10%, 1 năm -20%, có vip thì -5-10%
// người dùng tạo mới booking- tạo thì tạo cho luật sư nào, vào kiểu vụ án gì

// hiện ở trong cái chi tiết luật sư á
// cái này sẽ sẽ nhận vào cái kiểu vụ án mình cần tư vấn
// tính 1 cái range giá tiền theo cái type đó 
// client sẽ tạo request cho lawyer xem có nhận không
// khi gửi đi client sẽ ghi rõ ngày nào tới ngày nào hệ thống sẽ tính xèng theo chỗ đó, cái vip mình bổ sung sau
// chức năng "Rao giá"

// trước hết, ở đây user sẽ tạo 1 cái booking
// sau đó, thằng admin sẽ được accept hoặc reject cái booking đó
  @Post('userCreateBooking')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createBookingDto: CreateBookingDto,
  @Req() req,
  @Res() res:Response
) {
  try {
    const {userId} = req.user
    const respone = await this.bookingService.create(createBookingDto, userId)
    return res.status(respone.res).json(respone.message)
  } catch (error) {
    throw new Error(error)
  }
    
  }
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('/adminAcceptBooking')
  async acceptBooking(
    @Req() req, // admin
    @Res() res:Response,
    // params của user
    @Param('clientId') client_id: string
  ){

    const {userId} = req.user
    try {
      try {
        const response = await this.bookingService.acceptBooking(userId,client_id)
        return res.status(response.status).json(response.message)
      } catch (error) {
        throw new Error(error)
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  @Get()
  findAll() {
    return this.bookingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(+id, updateBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingService.remove(+id);
  }
}
