/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';

export class ListDto {
  @IsNotEmpty()
  pin: boolean;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  idNote: number;

  @IsNotEmpty()
  sortType: string;

  @IsNotEmpty()
  showTime: boolean;

  @IsNotEmpty()
  withCheckbox: boolean;
}
