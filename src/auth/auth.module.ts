import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { WechatService } from './wechat/wechat.service';
import { WechatController } from './wechat/wechat.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User])
  ],
  providers: [WechatService],
  controllers: [WechatController],
  exports: [WechatService]
})
export class AuthModule {}
