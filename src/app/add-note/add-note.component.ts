import { Component, OnInit, Input } from '@angular/core';
import { Note, HttpClientService } from '../service/http-client.service';

@Component({
  selector: 'app-add-note',
  templateUrl: './add-note.component.html',
  styleUrls: ['./add-note.component.css']
})
export class AddNoteComponent implements OnInit {

  user: string

  note: Note = new Note("", "", "", "", "")

  constructor(
    private httpClientService: HttpClientService,
  ) { }

  ngOnInit() {
    this.user = sessionStorage.getItem('username')
    this.note.author = sessionStorage.getItem('username')
  }
  createNote(): void {
    this.httpClientService.createNote(this.note)
      .subscribe(data => {
        window.location.reload(true);
      });

  };
}
