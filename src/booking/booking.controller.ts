import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Response } from 'express';
import { ApiBadGatewayResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/stratergy/jwt.guard';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}


// những option cho booking: booking trên 1 tháng -10%, 1 năm -20%, có vip thì -5-10%
// người dùng tạo mới booking- tạo thì tạo cho luật sư nào, vào kiểu vụ án gì


// khi gửi đi client sẽ ghi rõ ngày nào tới ngày nào hệ thống sẽ tính xèng theo chỗ đó, cái vip mình bổ sung sau
// chức năng "Rao giá"

// trước hết, ở đây user sẽ tạo 1 cái booking V
// sau đó, thằng admin sẽ được accept hoặc reject cái booking đó V 
// người dùng có thể request cho nhiều lawyer, nhưng khi 1 lawyer accept thì những request từ người dùng đó ở bảng khác phải mất
  @Post('/userCreateBooking')
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
  @Patch('/lawyerAcceptBooking/:clientId')
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
// api để lấy cái list accept hoặc request cho người dùng
  @Get("/LawyerGetListBooking")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAll(
@Req() req,
@Res() res:Response
  ){
    const{userId} = req.user
    try {
      const response = await this.bookingService.findAll(userId)
      return res.status(response.status).json(response.results)
    } catch (error) {
      throw new Error(error)
    }
  }
// api lấy chi tiết cái booking của user
// đảm bảo người lấy là lawyer, id là id của user
  @Get('detailUserBooking/:id')
  async findOne(@Param('id') id: string,
  @Res() res:Response,
  @Req() req
) {
    try {
      const {userId} = req.user
      const result = await this.bookingService.findOne(id,userId);
      return res.status(result.status).json(result.response)
    } catch (error) {
      throw new Error(error)
    }
  }
// rejectBooking nhận 1 clientId
  @Patch('rejectBooking/:clientId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async DeleteBooking(@Param('clientId') client_id: string,
@Res() res:Response,
@Req() req
) {
   try {
    const {userId} = req.user
    const response = await this.bookingService.DeleteBooking(userId,client_id);
    return res.status(response.status).json(response.message)
   } catch (error) {
    throw new Error()
   }
  }
// quá thời gian 


}
