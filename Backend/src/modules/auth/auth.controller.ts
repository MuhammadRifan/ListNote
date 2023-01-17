import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistrationDto } from './dtos/Registration.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post('login')
  login(@Body() userData: RegistrationDto): any {
    return this.authService.login(userData); // return JWT access token
  }

  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() userData: RegistrationDto): Promise<any> {
    const createdUser = await this.authService.register(userData);

    return {
      msg: createdUser.username + ' Registered !',
    };
  }
}
