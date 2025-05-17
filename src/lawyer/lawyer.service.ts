import { Injectable } from '@nestjs/common';
import { CloudUploadService } from 'src/shared/cloudUpload.service';
import { EmailService } from 'src/email/email.service';
import { AuthService } from 'src/auth/auth.service';
import { Booking, MarketPriceRange, Review, SubTypeLawyer, TypeLawyer, User, VipPackage } from 'src/config/database.config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateVipPackageDto } from '../vip-package/dto/create-vippackage.dto';
import { UpdateLawyerDto } from './dto/update-lawyer.dto';
import { FilterLawyerDto } from './dto/filterLawyer.dto';

@Injectable()
export class LawyerService {
// import chỗ schema kia vô
constructor(
  private readonly cloudUploadService : CloudUploadService,
  private readonly mailService : EmailService,
  private readonly authService : AuthService,
  @InjectModel(User.name) private readonly UserModel: Model<User>,
  @InjectModel(Review.name) private ReviewModal: Model<Review>,
  @InjectModel(TypeLawyer.name) private TypeLawyerModel: Model<TypeLawyer>,
  @InjectModel(SubTypeLawyer.name) private SubTypeLawyerModel: Model<SubTypeLawyer>,
  @InjectModel(VipPackage.name) private VipPackageModel: Model<VipPackage>,
  @InjectModel(Booking.name) private BookingModel: Model<Booking>,
  @InjectModel(MarketPriceRange.name) private MarketPriceRangeModel: Model<MarketPriceRange>
){}
// giờ mình sẽ làm thao tác với luật sư trước xong tới thao tác với người dùng
// luật sư sẽ có : thêm các gói
// thấy user trong các gói - thông tin sdt
// accept hoặc reject user
// quản lí lịch làm việc 
// thay đổi lí lịch luật sư trước đã xong mới updat trong chỗ khống chế giá
  async findAllLawyer() {
    try {
      const response = await this.UserModel.findOne({
        role:'lawyer' // chỗ lồn này tự lấy hết cái lawyer ra
      })
      return{
        status:200,
        response
      }
    } catch (error) {
      throw new Error(error)
    }
  }
  
  async update(updateLawyerDto:UpdateLawyerDto,userId:string) {
    try {
      const thisLawyer = await this.UserModel.findById(userId);
      if(thisLawyer?.role === 'lawyer'){
        const {description,type_lawyer,sub_type_lawyers,experienceYear,certificate} = updateLawyerDto

if (thisLawyer.typeLawyer === null || thisLawyer.typeLawyer === undefined) {
        const newTypeLawyer = await this.TypeLawyerModel.create({
          type:type_lawyer,
          lawyer_id:thisLawyer._id // chỗ này sẽ lấy cái lawyer dễ hơn
        })
        await this.UserModel.findByIdAndUpdate(userId,{
          description,
          typeLawyer:newTypeLawyer._id,
          certificate,
          experienceYear
        })
        await this.SubTypeLawyerModel.create({
          parentType: newTypeLawyer._id ,
          subType:sub_type_lawyers
        })
      }else{
        const idTypeLawyer = thisLawyer.typeLawyer;
        console.log(idTypeLawyer);
        
        // hắn sẽ tìm đến cái id đó xong thay thế hoàn toàn bằng cái mới
        await this.TypeLawyerModel.replaceOne({_id:idTypeLawyer},{
          type:type_lawyer,
          lawyer_id:userId
        });
        // sau khi update cái trên thì phải update cái cũ nữa
        await this.SubTypeLawyerModel.replaceOne({
          parentType:idTypeLawyer
        },{
          parentType:idTypeLawyer,
          subType:sub_type_lawyers
        })
        }
      return{
        status:200,
        message: "Cập nhật thành công"
      }
      }
      else{
        return{
          status:400,
          message:"Không phải lawyer thì không sửa được"
        }
      }
    } catch (error) {
      throw new Error(error)
    }
  }
  
// xóa luật sư ? 
  remove(id: number) {
    return `This action removes a #${id} lawyer`;
  }

//
async filterLawyers(filterDto: FilterLawyerDto): Promise<{ data: any[], total: number }> {
  const { stars, typeLawyer, province, page = 1, limit = 10 } = filterDto;
  const query: any = { role: 'lawyer' };

  // Lọc theo số sao (nếu có)
  if (stars !== undefined) {
    query.start = stars;
}

  // Lọc theo loại luật sư
  if (typeLawyer) {
    const typeLawyers = await this.TypeLawyerModel
      .find({ type: { $regex: typeLawyer, $options: 'i' } })
      .select('lawyer_id')
      .exec();

    const lawyerIds = typeLawyers.map((type) => type.lawyer_id);

    if (lawyerIds.length > 0) {
      query._id = { $in: lawyerIds };
    } else {
      return { data: [], total: 0 };
    }
  }

  // Lọc theo tỉnh thành
  if (province) {
    query.province = { $regex: province, $options: 'i' };
  }

  // Tính toán phân trang
  const skip = (page - 1) * limit;
  
  // Truy vấn dữ liệu với phân trang
  const [data, total] = await Promise.all([
    this.UserModel
      .find(query)
      .populate('typeLawyer')
      .skip(skip)
      .limit(limit)
      .exec(),
    this.UserModel.countDocuments(query).exec()
  ]);

  return { data, total };
}

async getDetailLawyer(id: string) {
  try {
    // Giả sử UserModel có field typeLawyer kiểu ObjectId ref 'TypeLawyer'
    console.log(id);
    
    const data = await this.UserModel.findById(id)
      .populate({
        path: 'typeLawyer', // populate đến TypeLawyer
      });

    if (data && data.typeLawyer) {
      const subTypes = await this.SubTypeLawyerModel.find({
        parentType: data.typeLawyer._id,
      });

      return {
        status: 200,
        data: {
          ...data.toObject(),
          subTypes,
        },
      };
    }

    return { status: 404, message: 'Lawyer not found' };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

}
