import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { WechatService } from './wechat.service';

@Controller('auth/wechat')
export class WechatController {
  constructor(private readonly wechatService: WechatService) {}

  @Post('login')
  async wechatLogin(
    @Body('code') code: string,
    @Body('userInfo') userInfo?: any,
  ) {
    return this.wechatService.wechatLogin(code, userInfo);
  }

  // 用于检查开发环境的配置是否正确
  @Get('check')
  async checkWechatConfig(@Query('code') code: string) {
    if (!code) {
      return {
        message: '请提供code参数',
      };
    }
    return this.wechatService.getWechatOpenid(code);
  }
}
