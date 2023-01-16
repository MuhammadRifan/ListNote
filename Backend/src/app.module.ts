import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { ListModule } from './modules/list/list.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/User';
import { Note } from './models/Note';
import { List } from './models/List';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'listnote',
      entities: [User, Note, List],
      synchronize: true,
    }),
    UserModule,
    ListModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
