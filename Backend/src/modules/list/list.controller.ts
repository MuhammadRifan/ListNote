import { Controller, Delete, Get, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ListService } from './list.service';

@Controller('list')
export class ListController {
  constructor(private listService: ListService) {}

  // List Route
  @UseGuards(JwtAuthGuard)
  @Get()
  getAllList(): any {
    return this.listService.getAllList();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  postList(): any {
    return this.listService.postList();
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  putList(): any {
    return this.listService.putList();
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  deleteList(): any {
    return this.listService.deleteList();
  }

  // Note Route
  @UseGuards(JwtAuthGuard)
  @Get('note')
  getAllNote(): any {
    return this.listService.getAllNote();
  }

  @UseGuards(JwtAuthGuard)
  @Post('note')
  postNote(): any {
    return this.listService.postNote();
  }

  @UseGuards(JwtAuthGuard)
  @Put('note')
  putNote(): any {
    return this.listService.putNote();
  }

  @UseGuards(JwtAuthGuard)
  @Delete('note')
  deleteNote(): any {
    return this.listService.deleteNote();
  }
}
