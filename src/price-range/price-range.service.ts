import { Injectable } from '@nestjs/common';
import { CreatePriceRangeDto } from './dto/create-price-range.dto';
import { UpdatePriceRangeDto } from './dto/update-price-range.dto';
import { MarketPriceRange, User } from 'src/config/database.config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { EmailService } from 'src/email/email.service';
import { CloudUploadService } from 'src/shared/cloudUpload.service';
@Injectable()
export class PriceRangeService {
  constructor(
      private readonly cloudUploadService : CloudUploadService,
      private readonly mailService : EmailService,
      private readonly authService : AuthService,
      @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(MarketPriceRange.name) private MarketPriceRangeModel: Model<MarketPriceRange>
  ){}

  async findAll() {
   try {
    const results = await this.MarketPriceRangeModel.find();
    return{
      status:200,
      results
    }
   } catch (error) {
    throw new Error(error)
   }
  }

// hiện chi tiết của cái Etype
  async findOne(id:string) {
  try {
    const response = await this.MarketPriceRangeModel.findOne({type:id})
    return{
      status:200,
      message:response
    } 
  } catch (error) {
    throw new Error(error)
  }
  }

  async update(type: string, updatePriceRangeDto: UpdatePriceRangeDto,userId:string) {
    try {
      const checkUser = await this.UserModel.findById(userId);
      if(checkUser?.role === 'admin'){
      await this.MarketPriceRangeModel.findOneAndUpdate({
        type:type
      },{
        minPrice:updatePriceRangeDto.minPrice,
        maxPrice:updatePriceRangeDto.maxPrice,
        description:updatePriceRangeDto.description
      })
      return{
        status:200,
        massage:"Update thành công"
      }
      } 
      return{
        status:404,
        massage:"Không đủ quyền"
      }
    } catch (error) {
      throw new Error(error)
    }
  }
}
