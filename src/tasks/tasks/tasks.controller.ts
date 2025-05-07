import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';

interface TaskQuery {
  page?: number;
  pageSize?: number;
  role?: string;
  tab?: string;
  searchKey?: string;
}

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // 创建任务
  @Post()
  async create(
    @Body('userId', ParseIntPipe) userId: number,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    const task = await this.tasksService.create(userId, createTaskDto);
    return {
      message: '任务创建成功',
      task
    };
  }

  // 获取任务列表
  @Get()
  async findAll(@Query() query: TaskQuery) {
    return this.tasksService.findAll(query);
  }

  // 获取单个任务详情
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.findOne(id);
  }

  // 获取雇主发布的任务
  @Get('employer/:employerId')
  async findByEmployer(@Param('employerId', ParseIntPipe) employerId: number) {
    return this.tasksService.findByEmployer(employerId);
  }

  // 更新任务
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body('userId', ParseIntPipe) userId: number,
    @Body() updateData: Partial<Task>,
  ) {
    const task = await this.tasksService.update(id, userId, updateData);
    return {
      message: '任务更新成功',
      task
    };
  }

  // 删除任务
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Body('userId', ParseIntPipe) userId: number,
  ) {
    await this.tasksService.remove(id, userId);
    return {
      message: '任务删除成功'
    };
  }
}
