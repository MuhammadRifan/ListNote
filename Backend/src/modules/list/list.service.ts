/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { List, sortType } from 'src/models/List';
import { User } from 'src/models/User';
import { Repository } from 'typeorm';
import { ListDto } from './dtos/list.dto';

function guessSortType(sortInput: string) {
  if (sortInput.toLocaleLowerCase() == 'defaultasc') return sortType.DefaultAsc;
  else if (sortInput.toLocaleLowerCase() == 'defaultdsc')
    return sortType.DefaultDsc;
  else if (sortInput.toLocaleLowerCase() == 'dateasc') return sortType.DateAsc;
  else if (sortInput.toLocaleLowerCase() == 'datedsc') return sortType.DateDsc;
  else if (sortInput.toLocaleLowerCase() == 'alphaasc')
    return sortType.AlphaAsc;
  else if (sortInput.toLocaleLowerCase() == 'alphadsc')
    return sortType.AlphaDsc;
}

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(List) private listRepository: Repository<List>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  // List Service
  async getAllList(userId: number): Promise<any> {
    const listData = await this.listRepository.find({
      where: { user: { id: userId } },
    });

    return {
      data: listData,
    };
  }

  async postList(id: number, listData: ListDto): Promise<any> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new HttpException(
        'User not found. Cannot create List',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newList = await this.listRepository.create();
    newList.pin = listData.pin;
    newList.title = listData.title;
    newList.idNote = listData.idNote;
    newList.sortType = guessSortType(listData.sortType);
    newList.showTime = listData.showTime;
    newList.withCheckbox = listData.withCheckbox;
    newList.user = user;

    return this.listRepository.save(newList)
  }

  putList(): any {
    return {
      data: [],
    };
  }

  deleteList(): any {
    return {
      data: [],
    };
  }

  // Note Service
  getAllNote(): any {
    return {
      data: [],
    };
  }

  postNote(): any {
    return {
      data: [],
    };
  }

  putNote(): any {
    return {
      data: [],
    };
  }

  deleteNote(): any {
    return {
      data: [],
    };
  }
}
