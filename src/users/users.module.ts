import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LearnPackage, LearnPackageSchema, SubTypeLawyer, SubTypeLawyerSchema, TypeLawyer, TypeLawyerSchema, User, UserSchema, VipPackage, VipPackageSchema } from 'src/config/database.config';

@Module({
  // có dòng này mới import được vào mongo
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: VipPackage.name, schema: VipPackageSchema },
      { name: LearnPackage.name, schema: LearnPackageSchema },
      {name:TypeLawyer.name,schema: TypeLawyerSchema},
      {name:SubTypeLawyer.name,schema :SubTypeLawyerSchema}
    ])
  ], controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
