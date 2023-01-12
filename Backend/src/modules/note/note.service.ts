import { Injectable } from '@nestjs/common';

@Injectable()
export class NoteService {
  getAllNote() {
    return 'note';
  }
}
