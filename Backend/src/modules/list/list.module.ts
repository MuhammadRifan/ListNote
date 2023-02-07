/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { List } from 'src/models/List';
import { User } from 'src/models/User';
import { ListController } from './list.controller';
import { ListService } from './list.service';

@Module({
  imports: [TypeOrmModule.forFeature([List, User])],
  controllers: [ListController],
  providers: [ListService],
})
export class ListModule {}
