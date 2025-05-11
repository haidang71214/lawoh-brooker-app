import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { AuthService } from 'src/auth/auth.service';
import { Booking, MarketPriceRange, Review, TypeLawyer, User, VipPackage } from 'src/config/database.config';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';


@Injectable()
export class BookingService {
  constructor(
    private readonly authService:AuthService,
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(Booking.name) private BookingModel: Model<Booking>,
    @InjectModel(VipPackage.name) private VipPackageModel: Model<VipPackage>,
    @InjectModel(TypeLawyer.name) private TypeLawyerModel: Model<TypeLawyer>,
    @InjectModel(Review.name) private ReviewModel: Model<Review>,
    @InjectModel(MarketPriceRange.name) private MarketPriceRangeModel: Model<MarketPriceRange> // db set cứng khoảng giá
  ){}
  // booking là của client tạo
  async create(createBookingDto: CreateBookingDto,userId:string) {
    try {
      const {lawyer_id,booking_end,booking_start,income,typeBooking,note} = createBookingDto
      const respone = await this.BookingModel.create({
        lawyer_id,
        client_id:userId,
        booking_end,
        booking_start,
        status:false,
        income,typeBooking,note
      });
      return{
        res:200,
        message:respone
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async acceptBooking(adminId:string,client_id:string){
    try {
      const check = await this.authService.checkAdmin(adminId);
      if(check){
        await this.BookingModel.findOneAndUpdate({client_id},{
          status:true     // tí xong check lại
        })
      }
      return{
        status:200,
        message:"Đã accept thành công"
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  findAll() {
    return `This action returns all booking`;
  }

  findOne(id: number) {
    return `This action returns a #${id} booking`;
  }

  update(id: number, updateBookingDto: UpdateBookingDto) {
    return `This action updates a #${id} booking`;
  }

  remove(id: number) {
    return `This action removes a #${id} booking`;
  }
}
