import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private httpClientService: HttpClientService
  ) { }

  authenticate(username, password) {
    this.httpClientService.getUser(username).subscribe(
      user => {
        if (username === user.username && password === user.password) {
          sessionStorage.setItem('username', username);
          return true;
        }
      })
    return false;
  }

  isUserLoggedIn() {
    let user = sessionStorage.getItem('username');
    return !(user === null);
  }

  logOut() {
    sessionStorage.removeItem('username');
  }
}
