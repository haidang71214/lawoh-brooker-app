import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class loginDto{
   @ApiProperty()
   @IsNotEmpty()
   email:String;
   // a
   @ApiProperty()
   @IsNotEmpty()
   password:String;
}