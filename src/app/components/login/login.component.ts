import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

export interface Auth {
  username: string;
  password: string;
  logged: boolean
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  authForm: FormGroup;
  

  constructor(private fb: FormBuilder) {
    this.authForm = this.fb.group({username: '', password: '', logged: false});
   }

  ngOnInit(): void {
  }

  logIn(value: Auth): void {
    console.log(value);
  }

}
