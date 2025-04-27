import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import axios from 'axios';

@Injectable()
export class WechatService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // 微信小程序登录配置
  private readonly appid = process.env.WECHAT_APPID || 'YOUR_APPID';
  private readonly secret = process.env.WECHAT_SECRET || 'YOUR_APP_SECRET';

  // 获取微信openid
  async getWechatOpenid(code: string) {
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${this.appid}&secret=${this.secret}&js_code=${code}&grant_type=authorization_code`;

    try {
      const response = await axios.get(url);
      const { openid, session_key } = response.data;
      
      if (!openid) {
        throw new Error('获取openid失败: ' + JSON.stringify(response.data));
      }
      
      return { openid, session_key };
    } catch (error) {
      console.error('获取微信openid失败:', error);
      throw new Error('微信登录失败，请稍后重试');
    }
  }

  // 微信登录或注册
  async wechatLogin(code: string, userInfo?: any) {
    // 获取微信openid
    const { openid, session_key } = await this.getWechatOpenid(code);
    
    // 查找或创建用户
    let user = await this.userRepository.findOne({ where: { openid } });
    
    if (!user) {
      // 创建新用户
      user = this.userRepository.create({
        openid,
        sessionKey: session_key,
      });
      
      // 如果有用户信息，更新用户资料
      if (userInfo) {
        user.username = userInfo.nickName;
        user.avatar = userInfo.avatarUrl;
      }
      
      await this.userRepository.save(user);
    } else {
      // 更新session_key
      user.sessionKey = session_key;
      
      // 如果有用户信息且用户之前没有设置过，则更新
      if (userInfo && (!user.username || !user.avatar)) {
        user.username = userInfo.nickName || user.username;
        user.avatar = userInfo.avatarUrl || user.avatar;
        await this.userRepository.save(user);
      }
    }
    
    // 返回用户信息和token（这里可以集成JWT等认证）
    return {
      user: {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        role: user.role,
      },
      // TODO: 生成JWT token
      token: `wechat_${openid}`,
    };
  }
}
