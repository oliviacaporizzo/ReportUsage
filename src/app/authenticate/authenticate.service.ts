import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import {Router} from '@angular/router';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class AuthenticateService {

  constructor(private http: Http, private router: Router) { }

  getToken(username: String): Promise<any> {
    return this.http.post('http://localhost:8080/api/authenticate', {username: username})
      .toPromise()
      .then(this.extractData)
  }

  isTokenValid(data) {
    if(!data.success) {
      this.router.navigate(['/authenticate']);
    }
  }

  checkIfLoggedIn(){
    if(localStorage.getItem('token') == null) {
      console.log('not logged in');
      //return null;
      //redirect to authentication
      this.router.navigate(['/authenticate']);
    } else {
      return localStorage.getItem('token');

    }
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || [];
}
}
