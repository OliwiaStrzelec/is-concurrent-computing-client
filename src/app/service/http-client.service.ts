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


const path = 'http://localhost:8080/api/users';
@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getUsers() {
    return this.httpClient.get<User[]>(path);
  }

  getUser(username) {
    return this.httpClient.get<User>(path + '/' + username);
  }

  deleteUser(user) {
    return this.httpClient.delete<User>(path + '/' + user.id);
  }

  createUser(user) {
    return this.httpClient.post<User>(path, user);
  }
}
