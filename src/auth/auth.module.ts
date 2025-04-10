import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema} from 'src/config/database.config';
import { MongooseModule } from '@nestjs/mongoose';
import { KeyModule } from 'src/key/key.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[
     MongooseModule.forFeature([
          { name: User.name, schema: UserSchema },
  ]), 
JwtModule.register({}), KeyModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
