import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as qs from 'qs';
import * as crypto from 'crypto';

dotenv.config();

@Injectable()
export class PaymentService {
  createPaymentUrl(amount: number, orderInfo: string, orderType: string, bankCode?: string): string {
    const tmnCode = process.env.VNP_TMN_CODE;
    const secretKey = process.env.VNP_HASH_SECRET;
    const vnpUrl = process.env.VNP_URL;
    const returnUrl = process.env.VNP_RETURN_URL;

    const date = new Date();
    const createDate = date.toISOString().replace(/[-:T]/g, '').slice(0, 14);
    const orderId = date.getTime().toString();
// lấy cái đống này gen ra
    const vnp_Params: any = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: orderType,
      vnp_Amount: amount * 100,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: '127.0.0.1',
      vnp_CreateDate: createDate,
    };

    if (bankCode) {
      vnp_Params['vnp_BankCode'] = bankCode;
    }

    const sortedParams = Object.keys(vnp_Params).sort().reduce((result, key) => {
      result[key] = vnp_Params[key];
      return result;
    }, {});
    // 
    if (!secretKey) {
  throw new Error('VNP_HASH_SECRET is not defined in the environment variables');
}
// 
    const signData = qs.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    sortedParams['vnp_SecureHash'] = signed;

    return `${vnpUrl}?${qs.stringify(sortedParams, { encode: false })}`;
  }
// xác thực xong trả về
  verifyVnpayReturn(query: any): boolean {
    const secureHash = query['vnp_SecureHash'];
    delete query['vnp_SecureHash'];
    delete query['vnp_SecureHashType'];
    const sortedParams = Object.keys(query).sort().reduce((result, key) => {
      result[key] = query[key];
      return result;
    }, {});
    const secretKey = process.env.VNP_HASH_SECRET;
    if (!secretKey) {
  throw new Error('VNP_HASH_SECRET is not defined in the environment variables');
}//

    const signData = qs.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    return secureHash === signed;
  }
}