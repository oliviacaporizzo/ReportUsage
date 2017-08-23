import { Component, OnInit } from '@angular/core';
import  {AuthenticateService } from './authenticate.service';
import { User } from '../models/user';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.css']
})
export class AuthenticateComponent implements OnInit{
  user: User = {username: '', password: ''};
  loginSuccess: boolean;

  constructor(private authService: AuthenticateService, private router: Router) {
   }

  ngOnInit() {
    //check for cookies?
    let logged = this.authService.checkIfLoggedIn();
     if(logged != null) {
         this.router.navigate(['/dashboard']);
     }
  }

  onSubmit(myForm) {
    var that = this;
    this.authService.getToken(myForm.value.username)
      .then(function(data){
        console.log(data);
        if(data.success == true){
          localStorage.setItem('token', data.token);
          localStorage.setItem('accountNumber', data.account);
          console.log('storedToken');
          that.router.navigate(['/dashboard']);
        } else {
          //show error
          alert('Incorrect Username or Password');
        }
      });
  }

}
