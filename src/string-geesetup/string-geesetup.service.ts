import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { GetTokenDto } from './dto/GetTokenDto';
import { CreateStringGeesetupDto } from './dto/create-string-geesetup.dto';



@Injectable()
export class StringGeesetupService {
  private readonly projectId: string;
  private readonly projectSecret: string;
  private readonly baseUrl: string;
  private readonly tokenHelperUrl: string;
  private restToken: string = '';

  constructor(private configService: ConfigService) {
   const projectId = process.env.PROJECT_ID
   const projectSecret = process.env.PROJECT_SECRET
   const baseUrl = process.env.BASE_STRINGEE
   const tokenHelperUrl = process.env.TOKEN_HELPER_URL
  }

  private _authHeader() {
    return { 'X-STRINGEE-AUTH': this.restToken };
  }

  async createRoom(dto: CreateStringGeesetupDto) {
    try {
      const roomName = dto.name || Math.random().toFixed(4);
      const uniqueName = dto.uniqueName || roomName;
      const response = await axios.post(
        `${this.baseUrl}/create`,
        { name: roomName, uniqueName },
        { headers: this._authHeader() },
      );
      return response.data;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create room');
    }
  }

  async setRestToken() {
    try {
      const tokens = await this.getToken({ rest: true });
      this.restToken = tokens.rest_access_token;
      return this.restToken;
    } catch (error) {
      throw new InternalServerErrorException('Failed to set REST token');
    }
  }

  async getUserToken(userId: string) {
    try {
      const tokens = await this.getToken({ userId });
      return tokens.access_token;
    } catch (error) {
      throw new InternalServerErrorException('Failed to get user token');
    }
  }

  async getRoomToken(roomId: string) {
    try {
      const tokens = await this.getToken({ roomId });
      return tokens.room_token;
    } catch (error) {
      throw new InternalServerErrorException('Failed to get room token');
    }
  }

  private async getToken({ userId, roomId, rest }: GetTokenDto) {
    try {
      const response = await axios.get(this.tokenHelperUrl, {
        params: {
          keySid: this.projectId,
          keySecret: this.projectSecret,
          userId,
          roomId,
          rest,
        },
      });
      return response.data;
    } catch (error) {
      throw new InternalServerErrorException('Failed to get token');
    }
  }
}