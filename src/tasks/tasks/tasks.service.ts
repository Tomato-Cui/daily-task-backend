import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Task } from '../entities/task.entity';
import { UsersService } from '../../users/users/users.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private usersService: UsersService,
  ) {}

  // 创建任务
  async create(employerId: number, createTaskData: Partial<Task>): Promise<Task> {
    // 验证用户角色
    const user = await this.usersService.findOne(employerId);
    if (user.role !== 'employer') {
      throw new Error('只有雇主才能发布任务');
    }

    const task = this.taskRepository.create({
      ...createTaskData,
      employerId,
      status: 'pending'
    });

    return this.taskRepository.save(task);
  }

  // 获取任务列表
  async findAll(query: any) {
    const { page = 1, pageSize = 10, role, tab, searchKey } = query;
    
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);

    const whereConditions: any = {};
    
    // if (role) {
    //   whereConditions.role = role;
    // }
    
    if (tab !== undefined && tab !== null && tab !== '') {
      whereConditions.status = Number(tab);
    }
    
    if (searchKey && searchKey.trim() !== '') {
      whereConditions.title = Like(`%${searchKey.trim()}%`);
    }
    

    const [tasks, total] = await this.taskRepository.findAndCount({
      skip,
      take,
      where: whereConditions,
      relations: ['employer'],
      order: {
        createdAt: 'DESC'
      }
    });

    return {
      data: tasks,
      total,
      page: Number(page),
      pageSize: Number(pageSize)
    };
  }

  // 获取单个任务详情
  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['employer'],
    });

    if (!task) {
      throw new NotFoundException(`任务ID:${id} 不存在`);
    }

    return task;
  }

  // 获取雇主发布的任务
  async findByEmployer(employerId: number): Promise<Task[]> {
    return this.taskRepository.find({
      where: { employerId },
      relations: ['employer'],
    });
  }

  // 更新任务
  async update(id: number, employerId: number, updateData: Partial<Task>): Promise<Task> {
    const task = await this.findOne(id);
    
    // 验证任务所有者
    if (task.employerId !== employerId) {
      throw new Error('只有任务发布者才能修改任务');
    }
    
    // 防止恶意更新敏感字段
    delete updateData.id;
    delete updateData.employerId;
    
    // 合并更新数据
    const updatedTask = { ...task, ...updateData };
    return this.taskRepository.save(updatedTask);
  }

  // 删除任务
  async remove(id: number, employerId: number): Promise<void> {
    const task = await this.findOne(id);
    
    // 验证任务所有者
    if (task.employerId !== employerId) {
      throw new Error('只有任务发布者才能删除任务');
    }
    
    await this.taskRepository.remove(task);
  }
}
