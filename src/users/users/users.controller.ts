import { Controller, Get, Post, Body, Param, Put, UseGuards, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 获取用户信息
  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);
    // 过滤敏感信息
    const { sessionKey, ...result } = user;
    return result;
  }

  // 更新用户角色
  @Put(':id/role')
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    const user = await this.usersService.updateRole(id, updateRoleDto.role);
    return {
      message: '角色更新成功',
      role: user.role,
      userInterfaceType: await this.usersService.getUserInterfaceType(id)
    };
  }

  // 更新用户资料
  @Put(':id/profile')
  async updateProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const user = await this.usersService.updateProfile(id, updateProfileDto);
    const { sessionKey, ...result } = user;
    return {
      message: '用户资料更新成功',
      user: result
    };
  }

  // 获取用户界面类型
  @Get(':id/interface-type')
  async getUserInterfaceType(@Param('id', ParseIntPipe) id: number) {
    return {
      interfaceType: await this.usersService.getUserInterfaceType(id)
    };
  }
}
