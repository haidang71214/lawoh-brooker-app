import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { AuthService } from 'src/auth/auth.service';
import { Booking, CustomPrice, MarketPriceRange, Review, TypeLawyer, User, VipPackage } from 'src/config/database.config';
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
    @InjectModel(MarketPriceRange.name) private MarketPriceRangeModel: Model<MarketPriceRange>, // db set cứng khoảng giá
    @InjectModel(CustomPrice.name) private CustomPriceModel: Model<CustomPrice>,
  
  ){}
  // booking là của client tạo
  async create(createBookingDto: CreateBookingDto,userId:string) {
    try {
      const {lawyer_id,booking_end,booking_start,typeBooking,note} = createBookingDto
      // lấy giá từ chính cái giá mà thằng luật sư đó setup
      const findCustomPriceByLawyer = await this.CustomPriceModel.findOne({
        lawyer_id:lawyer_id,
        type:typeBooking
      })
      //check bookingDate now

      // tính income, mình có thể lấy 10% user -> admin -> lawyer
      const respone = await this.BookingModel.create({
        lawyer_id,
        client_id:userId,
        booking_end,
        booking_start,
        status:'none',
        income:findCustomPriceByLawyer?.price, // income được lấy từ cái tiền, type của thằng lawyer
        typeBooking,
        note
      });
      return{
        res:200,
        message:respone
      }
    } catch (error) {
      throw new Error(error)
    }
  }
// thuật toán chỗ này cần chặt chẽ hơn
// thanh toán 
  async acceptBooking(lawyerid:string,client_id:string){
    try {
      const check = await this.authService.checkLawyer(lawyerid);
      if(check){
        //'none','accept','reject'
       const hehe =  await this.BookingModel.findOneAndUpdate({client_id,lawyer_id:lawyerid},{
          status:"accept"   
        })
 // cái lồn này accept cái là mấy cái khác xóa,check thêm 1 điều kiện về type nữa
          await this.BookingModel.deleteMany({
          client_id,
          lawyer_id: { $ne: lawyerid }, // nó sẽ tự xóa những cái mà nó liên kết với những lawyer khác
          typeBooking : hehe?.typeBooking
       });
      } 

      return{
        status:200,
        message:"Đã accept thành công"
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async findAll(userId:string) {
    try {
      const results = await this.BookingModel.findOne({lawyer_id:userId})
      return{
        status:200,
        results
      }
    } catch (error) {
      throw new Error(error)
    }
  }
// logic để lấy đã đặt là nằm ở đây
  async findOne(id: string,userId:string) {
   try {
    const response = await this.BookingModel.findOne({
      client_id:id,
      lawyer_id:userId
    })
    return{
      status:200,
      response
    }
   } catch (error) {
    throw new Error(error)
   }
  }


  async DeleteBooking(lawyerid :string,client_id:string){
    try {
      const check = await this.authService.checkLawyer(lawyerid);
      if(check){
      // reject thì giữ nguyên, không xóa
       await this.BookingModel.findOneAndUpdate({client_id,lawyer_id:lawyerid},{
          status:"reject"   
        })
      } 

      return{
        status:200,
        message:"Đã Reject thành công"
      }
    } catch (error) {
      throw new Error(error)
    }
}
}
