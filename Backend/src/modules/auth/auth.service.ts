/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/User';
import { comparePasswords, encodePassword } from 'src/utils/bcrypt';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(user: any) {
    const userData = await this.userRepository.findOneBy({
      username: user.username,
    });

    if (!userData)
      throw new HttpException(
        'Username Atau Password Salah',
        HttpStatus.BAD_REQUEST,
      );

    const matched = comparePasswords(user.password, userData.password);
    if (!matched) 
      throw new HttpException(
        'Username Atau Password Salah',
        HttpStatus.BAD_REQUEST,
      );

    const payload = { name: user.name, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload)
    };
  }

  async register(userData: any) {
    const user = await this.userRepository.findOneBy({
      username: userData.username,
    });

    if (user)
      throw new HttpException('Username Already Used!', HttpStatus.BAD_REQUEST);

    userData.password = await encodePassword(userData.password);

    const newUser = this.userRepository.create({ ...userData });
    await this.userRepository.save(newUser);

    return await this.userRepository.findOneBy({ username: userData.username });
  }
}
