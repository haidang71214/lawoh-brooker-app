import { Controller, Get, Post, Body, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // Tạo payment
  @Post('/create_payment_url')
  createPayment(@Body() body: any, @Res() res: Response) {
    const { amount, orderInfo, orderType, bankCode } = body;
    const paymentUrl = this.paymentService.createPaymentUrl(amount, orderInfo, orderType, bankCode);
    return res.redirect(paymentUrl);
  }

  // Xử lý thanh toán từ VNPAY
  @Get('/vnpay_return')
  handleVnpayReturn(@Query() query: any, @Res() res: Response) {
    const isValid = this.paymentService.verifyVnpayReturn(query);
    if (isValid) {
      res.render('success', { code: query['vnp_ResponseCode'] });
    } else {
      res.render('success', { code: '97' });
    }
  }

  // Xử lý thông báo
  @Get('/vnpay_ipn')
  handleVnpayIpn(@Query() query: any, @Res() res: Response) {
    const isValid = this.paymentService.verifyVnpayReturn(query);
    if (isValid) {
      const orderId = query['vnp_TxnRef'];
      const rspCode = query['vnp_ResponseCode'];
      res.status(200).json({ RspCode: '00', Message: 'success' });
    } else {
      res.status(200).json({ RspCode: '97', Message: 'Fail checksum' });
    }
  }
}