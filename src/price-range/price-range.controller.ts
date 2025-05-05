import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards, Req } from '@nestjs/common';
import { PriceRangeService } from './price-range.service';
import { CreatePriceRangeDto } from './dto/create-price-range.dto';
import { UpdatePriceRangeDto } from './dto/update-price-range.dto';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/stratergy/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('price-range')
export class PriceRangeController {
  constructor(private readonly priceRangeService: PriceRangeService) {}

  @Get()
  async findAll(@Res() res:Response) {
   try {
    const response = await this.priceRangeService.findAll();
    return res.status(response.status).json(response.results)
  } catch (error) {
    throw new Error(error)
  }
  }

  @Get(':type')
   async findOne(@Param('type') id: string,@Res() res:Response) {
    try {
        const response = await this.priceRangeService.findOne(id);
        return res.status(response.status).json(response.message)
    } catch (error) {
      throw new Error(error)
    }
  }

  @Patch(':type')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async update(@Param('type') type: string, @Body() updatePriceRangeDto: UpdatePriceRangeDto,@Req() req,@Res() res:Response) {
try {
  const userId = req.user.userId
  const response = await  this.priceRangeService.update(type, updatePriceRangeDto,userId);
  return res.status(response.status).json(response.massage)
} catch (error) {
  throw new Error(error)
}
   
  }
}
