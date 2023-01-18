/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ListDto } from './dtos/list.dto';
import { ListService } from './list.service';

@Controller('list')
export class ListController {
  constructor(private listService: ListService) {}

  // List Route
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getAllList(@Param('id', ParseIntPipe) id: number): any {
    return this.listService.getAllList(id);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post(':id')
  postList(
    @Param('id', ParseIntPipe) id: number,
    @Body() listData: ListDto,
  ): any {
    return this.listService.postList(id, listData);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  putList(@Param('id', ParseIntPipe) id: number): any {
    return this.listService.putList();
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteList(@Param('id', ParseIntPipe) id: number): any {
    return this.listService.deleteList();
  }

  // Note Route
  @UseGuards(JwtAuthGuard)
  @Get('note/:id')
  getAllNote(@Param('id', ParseIntPipe) id: number): any {
    return this.listService.getAllNote();
  }

  @UseGuards(JwtAuthGuard)
  @Post('note/:id')
  postNote(@Param('id', ParseIntPipe) id: number): any {
    return this.listService.postNote();
  }

  @UseGuards(JwtAuthGuard)
  @Put('note/:id')
  putNote(@Param('id', ParseIntPipe) id: number): any {
    return this.listService.putNote();
  }

  @UseGuards(JwtAuthGuard)
  @Delete('note/:id')
  deleteNote(@Param('id', ParseIntPipe) id: number): any {
    return this.listService.deleteNote();
  }
}
