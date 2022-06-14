import { Component, OnInit, Output } from '@angular/core';

import { EventEmitter } from '@angular/core';

import { FormControl, FormGroup, Validators} from '@angular/forms';

import { Router } from '@angular/router';

import { UserInterface } from 'src/app/user-interface';

import { UsersService } from 'src/app/users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {

  @Output() showRegisterForm = new EventEmitter<boolean>();

  @Output() showLoginForm = new EventEmitter<boolean>();
    
  registerForm = new FormGroup({
    firstName: new FormControl(null, [
      Validators.required,
      Validators.minLength(2)
    ]),
    lastName: new FormControl(null, [
      Validators.required,
      Validators.minLength(2)
    ]),
    email: new FormControl(null, [
      Validators.required,
      Validators.email
    ]),       
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

  errorMessage: string = "Email/User already exists.";

  errorMessagePassword: string = "";

  errorMessageConfirmPassword: string = "";

  boolShowForm: boolean = false;

  boolShowLoginForm: boolean = false;

  boolNewUser: boolean = false;

  boolPasswordError: boolean = false;

  constructor(private usersService: UsersService, private router: Router) {}

  ngOnInit(): void {
    this.usersService.getUsersDatabase().subscribe((usersArray) => {
      this.users = usersArray;     
    }); 
  }

  onSubmit() {

    this.getUserDetails();
    
    this.boolNewUser= this.usersService.checkForExistingUser(this.user.email, this.users);
   
    if(this.boolNewUser) {

      this.errorMessage = "";

      this.usersService.addNewUser(this.user).subscribe((user) => {           
        this.closeRegisterForm();
      });        
             
    }

  }

  getUserDetails() {
    let id: number = (Object.keys(this.users).length) + 1;
    
    let date = new Date();
        
    this.user.id = id;
    this.user.email = this.registerForm.value.email;
    this.user.password = this.registerForm.value.password;
    this.user.firstname = this.registerForm.value.firstName;
    this.user.lastname = this.registerForm.value.lastName;
    this.user.createdOn = date;

  }

  checkPassword() { 

    if(this.registerForm.value.password === null){

      this.errorMessagePassword = "Please enter a password."
      this.boolPasswordError = true;

    } else {

      if(this.registerForm.value.password.length < 6) {

        this.errorMessagePassword = "Passwords must be at least 6 characters in length.";
        this.boolPasswordError = true;

      }else {

        if(this.registerForm.get('password')?.errors){ 

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
  
    if(this.registerForm.value.password !== null) {
      
      let boolGoodPassword: boolean = this.usersService.checkPasswordMatch(this.registerForm.value.password, this.registerForm.value.confirmPassword);

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

    if(this.errorMessageConfirmPassword !== null){
      this.errorMessageConfirmPassword = "";
    }
    
  }

  closeRegisterForm(){

    this.showRegisterForm.emit(this.boolShowForm);

    this.boolShowLoginForm = true;

    this.showLoginForm.emit(this.boolShowLoginForm);

    this.errorMessage = "";

    this.errorMessageConfirmPassword = "";

  }

}
