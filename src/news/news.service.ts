import { Injectable, Req, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { AuthService } from 'src/auth/auth.service';
import { New, User } from 'src/config/database.config';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtAuthGuard } from 'src/auth/stratergy/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CloudUploadService } from 'src/shared/cloudUpload.service';
import { response, Response } from 'express';
import { News } from './entities/news.entity';

@Injectable()
export class NewsService {
  constructor(
    private readonly authService : AuthService,
    private readonly cloudUploadService : CloudUploadService,
    @InjectModel(New.name) private NewModel: Model<New>,
    @InjectModel(User.name) private UserModel: Model<User>
  ){}
// user tạo mới tin

  async create(createNewsDto: CreateNewsDto,
    userId:string
     ) {
    try {
      const {content,image_urls,mainTitle,type} = createNewsDto
      const checkAdmin = await this.authService.checkAdmin(userId) 
      const checkLawyer = await this.authService.checkLawyer(userId) 
    if(checkAdmin || checkLawyer){
      const response = await this.NewModel.create({
        type,
        content,
        image_url:image_urls,
        //  ai là người tạo  
        userId:userId,
        mainTitle
      })
      return{
        status:200,
        message:response
      }
    }else{
      return{
        status:403,
        message:"Không đủ quyền"
      }
    }
    } catch (error) {
      throw new Error(error)
    }
  }
// user get hết tin
  async findAll(userId:string) {
    try {
      const checkLawyer = await this.authService.checkLawyer(userId)
      const checkAdmin = await this.authService.checkAdmin(userId);
      if(checkLawyer || checkAdmin){
        const data = await this.NewModel.find({
          userId:userId
        })
        return {
          status:200,
          message:data
        }

      }else{
        return {
          status:403,
          message:'Không xác thực'
        }
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async getAllFuckingShit(){
    try {
      const response =await this.NewModel.find().populate('userId')
      return response
    } catch (error) {
      throw new Error(error)
    }
  }

  async findOne(id: string) {
    try {
      const response = await this.NewModel.findById(id).populate('userId')
      return response
    } catch (error) {
      throw new Error(error)
    }
     }

 async update(id:string) {
    try {
      const response = await this.NewModel.findByIdAndUpdate(id,{
        isAccept:true
      })
      return response
    } catch (error) {
      throw new Error(error)
    }  
  }

  async remove(id: string,userId:string) {
   try {
    const checkAdmin = await this.authService.checkAdmin(userId);
    // check chính người đăng
    console.log(checkAdmin);
    
    const findNews = await this.NewModel.findById(id);
    if(checkAdmin || findNews?.userId === new Types.ObjectId(userId)){
        console.log('đủ điều kiện xóa r');
        const deleteNews = await this.NewModel.findByIdAndDelete(id);
        return deleteNews
    }else{
      return 'Không đủ quyền'
    }
   } catch (error) {
    throw new Error(error);
    
    
   }
  }
}
