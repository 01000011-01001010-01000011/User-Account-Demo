import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators} from '@angular/forms';

import { UserInterface } from 'src/app/user-interface';
import { UsersService } from 'src/app/users.service';

import { EmailService } from 'src/app/emailservice';

import { Router } from '@angular/router';

import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @Output() onLogin: EventEmitter<boolean> = new EventEmitter();

  @Output() showLoginForm = new EventEmitter<boolean>();

  @Output() showRegisterForm = new EventEmitter<boolean>();

  @Output() getUserName = new EventEmitter<string>();

  @ViewChild('password') myPassword!: ElementRef; 
  
  loginForm = new FormGroup({
    email: new FormControl(null, [
      Validators.required,
      Validators.email
      ]),       
    password: new FormControl(null, [
      Validators.required, 
      Validators.minLength(6)
    ]),
    rememberMe: new FormControl()
  });
  
  users: UserInterface[] = [];
    
  boolLogin: boolean = false;

  boolShowForm: boolean = false;

  boolShowRegisterForm: boolean = false;

  boolRememberMe: boolean = false;

  userEmail: string = "";

  messageToUser: string = "";
  
  constructor(private usersService: UsersService, private emailService: EmailService, private router: Router){} 

  ngOnInit(): void {
    this.usersService.getUsersDatabase().subscribe((usersArray) => {
      this.users = usersArray;      
    });       
    
    this.checkRememberMe();
   
  }
  
  ngAfterViewInit() {
    if(this.boolRememberMe) {
      setTimeout(() => {
        this.myPassword.nativeElement.focus();    
      }, 500);    
    }  
  }

  onSubmit() {

    let boolExistingUser:boolean = this.usersService.checkForExistingUser(this.loginForm.value.email, this.users);

    if(!boolExistingUser) {

      this.boolLogin = this.usersService.checkUserLogin(this.loginForm.value.email, this.loginForm.value.password, this.users, this.boolRememberMe);
      
      if(this.boolLogin) {      

        this.onLogin.emit(this.boolLogin);

        this.showLoginForm.emit(this.boolShowForm);

        let user = this.usersService.getUser();

        this.getUserName.emit(user?.pop()?.toString());         
            
        this.clearForm();

      } else {

        this.messageToUser = "Email or password is incorrrect.";

      }

    }else {
      this.messageToUser = "Email not found.";
    }

  }

  onChange() {
    this.boolRememberMe = !this.boolRememberMe;
  }

  checkRememberMe() {
    this.boolRememberMe = this.usersService.getRememberMeValue();

    if(this.boolRememberMe){
      this.loginForm.setValue(
        {
          email: this.usersService.getEmail(),
          rememberMe: this.boolRememberMe,
          password: ""
        }
      );
    }
  }

  clearError(event: KeyboardEvent) {       
    if(event.key !== "backspace" || event.key === "backspace" ){     
        this.messageToUser = "";
    }
  }

  clearForm() {
    this.loginForm.value.email = "";
    this.loginForm.value.password = "";
  }

  closeLoginForm(){

    this.clearForm();

    this.onLogin.emit(this.boolLogin);
      
    this.showLoginForm.emit(this.boolShowForm);
    
  } 

  onShowSignUp() {

    this.boolShowForm = false;

    this.showLoginForm.emit(this.boolShowForm);

    this.boolShowRegisterForm = true;

    this.showRegisterForm.emit(this.boolShowRegisterForm);

  }

  resetPassword() {

    let email: string = this.loginForm.value.email;
    
    if(email) {

      let boolExistingUser = this.usersService.checkForExistingUser(email, this.users);

        if(!boolExistingUser) {
        /* This is where an email service or module would be utilized to 1) create an email to send to the user with link to reset their password 
        2) If this is the legitimate email owner/user the link would be used to open a reset password form/component
        For this demo the email will be skipped and just the link to the reset form will be utilized instead */

        let emailLink = this.emailService.createLinkToResetPassword(email);

        this.emailService.openResetPasswordForm(emailLink);

      }else {
        this.messageToUser = "Email not found.";
      } 
    
    }

  }

}
