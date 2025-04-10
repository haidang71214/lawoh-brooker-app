import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { AuthService } from './auth.service';

import { Response } from 'express';
import { loginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/loginUser")
  create(
    @Body() loginDto:loginDto,
    @Res() res: Response,
  ) {
    try {
      const response = this.authService.login(res,loginDto)
      return res.status(200).json(response)
    } catch (error) {
      return error
    }
  }
  @Post('register')
  async register(@Res() res, @Body() body: RegisterDto) {
    return this.authService.register(res, body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }



}
