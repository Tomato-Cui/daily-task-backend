import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // 获取用户信息
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`用户ID:${id} 不存在`);
    }
    return user;
  }

  // 更新用户角色
  async updateRole(id: number, role: string): Promise<User> {
    // 验证角色是否有效
    if (!['employer', 'worker', 'user'].includes(role)) {
      throw new Error('无效的角色类型，角色必须是 employer(雇主) 或 worker(接单人) 或 user(普通用户)');
    }

    const user = await this.findOne(id);
    user.role = role;
    return this.userRepository.save(user);
  }

  // 更新用户资料
  async updateProfile(id: number, updateData: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    
    // 防止恶意更新敏感字段
    delete updateData.id;
    delete updateData.openid;
    delete updateData.sessionKey;
    
    // 合并更新数据
    const updatedUser = { ...user, ...updateData };
    return this.userRepository.save(updatedUser);
  }

  // 获取当前用户界面类型
  async getUserInterfaceType(id: number): Promise<string> {
    const user = await this.findOne(id);
    switch(user.role) {
      case 'employer':
        return 'employer_interface'; // 雇主界面
      case 'worker':
        return 'worker_interface';  // 接单人界面
      default:
        return 'default_interface'; // 默认界面
    }
  }
}
