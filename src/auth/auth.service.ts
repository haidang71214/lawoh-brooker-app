import { Injectable } from '@nestjs/common';

import { loginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/config/database.config';
import { JwtService } from '@nestjs/jwt';
import { KeyService } from 'src/key/key.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
// truyền đối tượng, nói thật về khoản này prisma sẽ khỏe hơn
constructor(
@InjectModel(User.name) private readonly user_model = Model<User>,
private readonly jwtService : JwtService,
private readonly keyService : KeyService
){}

  
  async login(res:any,body:loginDto):Promise<any>{
    try {
      const {email,password} = body;
      const findUser = await this.user_model.findOne({email:email})
      // em tạo schema ở đây rồi mà nó không gợi ý cho em ạ kiểu findUser._id hoặc findUser.name, 
      console.log(findUser);
      if(!findUser){
        return res.status(404).json({message:"User not found"})
      };
       if (!findUser) {
        throw new Error('không có trong hệ thống');
      }
      
      const checkPass = await bcrypt.compare(password, findUser.password);
      if (!checkPass) {
        throw new Error('sai password');
      }
      // trong này hắn sẽ mã hóa cái cục 
      const token = this.jwtService.sign(
        { data: { userId: findUser._id } },
        { expiresIn: '7d',
          secret: this.keyService.getPrivateKey(),
          algorithm: 'RS256',}
      )
          const refToken = this.jwtService.sign(
        { data: { userId: findUser._id } },
        {
          expiresIn: '7d',
          secret: this.keyService.getRefTokenPrivateKey(),
          algorithm: 'RS256',
        },
      );

    } catch (error) {
 throw new Error(error);
    }
  }

  async register(res:any,body:RegisterDto){
    try {
      const data = {
        email : body.email,
        name : body.name,
        password:body.password,
        phone:body.phone
      }
      const response = this.user_model.create(data)
      res.status(200).json(response)
    } catch (error) {
      throw new error
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }



}
