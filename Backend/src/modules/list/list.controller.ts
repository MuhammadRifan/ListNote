import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { ListService } from './list.service';

@Controller('list')
export class ListController {
  constructor(private listService: ListService) {}

  // List Route
  @Get()
  getAllList(): any {
    return this.listService.getAllList();
  }

  @Post()
  postList(): any {
    return this.listService.postList();
  }

  @Put()
  putList(): any {
    return this.listService.putList();
  }

  @Delete()
  deleteList(): any {
    return this.listService.deleteList();
  }

  // Note Route
  @Get('note')
  getAllNote(): any {
    return this.listService.getAllNote();
  }

  @Post('note')
  postNote(): any {
    return this.listService.postNote();
  }

  @Put('note')
  putNote(): any {
    return this.listService.putNote();
  }

  @Delete('note')
  deleteNote(): any {
    return this.listService.deleteNote();
  }
}
