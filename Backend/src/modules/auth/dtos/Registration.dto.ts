/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';

export class RegistrationDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
