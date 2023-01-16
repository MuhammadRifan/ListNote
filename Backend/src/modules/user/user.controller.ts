import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getAllUser() {
    return this.userService.getAllUser();
  }

  @Post('login')
  login(): any {
    return { msg: 'Logged in!' };
  }

  @Post('register')
  register(): any {
    return { msg: 'Registered!' };
  }
}
