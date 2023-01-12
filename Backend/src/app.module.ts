import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { NoteModule } from './modules/note/note.module';

@Module({
  imports: [UserModule, NoteModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
