import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export class User {
  constructor(
    public id: string,
    public name: string,
    public username: string,
    public password: string,
  ) { }
}

export class Note {
  constructor(
    public id: string,
    public author: string,
    public title: string,
    public content: string,
    public created: string,

  ) { }
}

export class File {
  constructor(
    public id: string,
    public name: string,
    public added: string,
    public addedBy: string,

  ) { }
}


const path = 'http://localhost:8080/api/';
@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  constructor(
    private httpClient: HttpClient
  ) { }

  usersPath = path + 'users';
  notesPath = path + 'notes';
  filesPath = path + 'files';

  getUsers() {
    return this.httpClient.get<User[]>(this.usersPath);
  }

  getUser(username) {
    return this.httpClient.get<User>(this.usersPath + '/' + username);
  }

  deleteUser(user) {
    return this.httpClient.delete<User>(this.usersPath + '/' + user.id);
  }

  createUser(user) {
    return this.httpClient.post<User>(this.usersPath, user);
  }

  getNotes() {
    return this.httpClient.get<Note[]>(this.notesPath);
  }

  createNote(note) {
    return this.httpClient.post<User>(this.notesPath, note);
  }
  
  getFilesByName(filename) {
    return this.httpClient.get<File[]>(this.filesPath + '/' + filename);
  }
  
  addFile(file) {
    return this.httpClient.post<File>(this.filesPath, file);
  }
}
