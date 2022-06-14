import { Component, OnInit, Input, Output } from '@angular/core';

import { EventEmitter } from '@angular/core';

import { HttpHeaders } from '@angular/common/http';

import { FormControl, FormGroup, Validators} from '@angular/forms';

import { Router } from '@angular/router';

import { UserInterface } from 'src/app/user-interface';

import { UsersService } from 'src/app/users.service';
import { EmailService } from 'src/app/emailservice';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss']
})
export class ResetpasswordComponent implements OnInit { 

  @Input() email: string = "";
 
  @Output() showLoginForm = new EventEmitter<boolean>();
    
  resetPasswordForm = new FormGroup({  
    password: new FormControl(null, [
      Validators.required, 
      Validators.minLength(6),
      Validators.maxLength(20),
      Validators.pattern("^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$")
    ]),
    confirmPassword: new FormControl(null, [
      Validators.required
    ]),  
  });
  
  users: UserInterface[] = [];

  user: UserInterface = {} as UserInterface;
 
  positionInArray: number = -1;

  userEmail: string = "";

  errorMessage: string = "Email/User already exists.";

  errorMessagePassword: string = "";

  errorMessageConfirmPassword: string = "";

  messageToUser:string = "";

  boolShowForm: boolean = true;

  boolShowLoginForm: boolean = false;

  boolPasswordError: boolean = false;

  constructor(private usersService: UsersService, private emailService: EmailService, private router: Router) { }
  

  ngOnInit(): void {

    let email = this.emailService.getEmailAddressFromURL(this.router.url);
     
    this.usersService.getUsersDatabase().subscribe((usersArray) => {
      
      this.users = usersArray;    
        
      if(this.users) {    
        this.positionInArray = this.usersService.getUserPositionFromEmail(email, this.users);

        if(this.positionInArray > -1) {

          this.getUserDetails();

        }      
        
      }

    });
    
  }

  onSubmit() {
    let timeLeft:number = 5;

    this.user.password = this.resetPasswordForm.value.password;
        
    this.usersService.updateUser(this.user).subscribe((user) => {
        
      setInterval(() =>  {      
        this.messageToUser = "Password updated successfully! Closing in: " + timeLeft;  
        timeLeft = timeLeft - 1;
      }, 900);
  
      let timer = setTimeout(() => {
        this.closeResetPasswordForm();
      }, 5000);

    });


  }


  showMessage(timeLeft: number) {
   
  }

    getUserDetails() {    
    this.user.id = this.users[this.positionInArray].id;
    this.user.email =  this.users[this.positionInArray].email;
    this.user.password = this.users[this.positionInArray].password;
    this.user.firstname = this.users[this.positionInArray].firstname;
    this.user.lastname = this.users[this.positionInArray].lastname;
    this.user.createdOn = this.users[this.positionInArray].createdOn;
  }

  checkPassword() { 

    if(this.resetPasswordForm.value.password === null){
      this.errorMessagePassword = "Please enter a password."
      this.boolPasswordError = true;
    } else {
      if(this.resetPasswordForm.value.password.length < 6) {
        this.errorMessagePassword = "Passwords must be at least 6 characters in length.";
        this.boolPasswordError = true;
      }else {
        if(this.resetPasswordForm.get('password')?.errors){ 
          this.errorMessagePassword = "Passwords must contain at least 1 uppercase letter, 1 lowercase letter, and 1 special character."
          this.boolPasswordError = true;
        }else {
          this.errorMessagePassword = "";
          this.boolPasswordError = false;        
        }
      }
    } 

  }

  
  checkPasswordMatch() {
  
    if(this.resetPasswordForm.value.password !== null) {
      
      let boolGoodPassword: boolean = this.usersService.checkPasswordMatch(this.resetPasswordForm.value.password, this.resetPasswordForm.value.confirmPassword);

      if(!boolGoodPassword) {
        
        this.errorMessageConfirmPassword = "Passwords do not match.";
      
      }else {
        
        this.errorMessageConfirmPassword = "";      
      
      }
    
    }

  }

  clearErrors(event: KeyboardEvent) {       
    if(this.boolPasswordError || event.key === "backspace"){     
      this.errorMessagePassword = "";     
      this.boolPasswordError = false;     
    }    
    this.errorMessageConfirmPassword = "";

  }

  closeResetPasswordForm() {

    this.boolShowLoginForm = true;

    this.showLoginForm.emit(this.boolShowLoginForm);

    this.router.navigate(['/']);

  }

}
