import { Controller, Get } from '@nestjs/common';
import { NoteService } from './note.service';

@Controller('note')
export class NoteController {
  constructor(private noteService: NoteService) {}

  @Get()
  getAllNote() {
    return this.noteService.getAllNote();
  }
}
