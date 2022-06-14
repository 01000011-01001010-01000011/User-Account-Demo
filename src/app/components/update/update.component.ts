import { Component, OnInit, Output } from '@angular/core';

import { EventEmitter } from '@angular/core';

import { FormControl, FormGroup, Validators} from '@angular/forms';

import { Router } from '@angular/router';

import { UserInterface } from 'src/app/user-interface';

import { UsersService } from 'src/app/users.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {

  @Output() showUpdateForm = new EventEmitter<boolean>();
  
  @Output() getUserName = new EventEmitter<string>();
        
  updateForm = new FormGroup({
    password: new FormControl(null, [     
      Validators.minLength(6),
      Validators.maxLength(20),
      Validators.pattern("^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$")
    ]),
    confirmPassword: new FormControl(null, [
      Validators.required
    ]),
    firstName: new FormControl(null, [      
      Validators.minLength(2)
    ]),
    lastName: new FormControl(null, [      
      Validators.minLength(2)
    ])     
  });

  users: UserInterface[] = []; 

  user: UserInterface = {} as UserInterface;

  currentUserData = this.usersService.getUser();

  positionInArray: number = -1;

  errorMessagePassword: string = "";

  errorMessageConfirmPassword: string = "";

  firstName: string = "";

  lastName: string = "";

  boolShowForm: boolean = false;

  boolShowLoginForm: boolean = false;

  boolPasswordError: boolean = false;
  
  constructor(private usersService: UsersService, private router: Router) {}

  ngOnInit(): void {

    this.currentUserData = this.usersService.getUser();

    this.usersService.getUsersDatabase().subscribe((usersArray) => {
      this.users = usersArray;    
      if(this.currentUserData) {    
        this.positionInArray = this.usersService.getUserPositonFromID(Number(this.currentUserData[0]), this.users);
        
        if(this.positionInArray) {
          this.getUserDataFromArray(this.positionInArray, this.users);

          this.fillInUserDetails();
        }
      }
    }); 
       
  }

  onSubmit() {

    this.getUserDetails();
       
    this.usersService.clearUser();

    this.usersService.updateUser(this.user).subscribe((user) => {
      this.user
    });

    let user = this.usersService.getUser();

    this.getUserName.emit(user?.pop()?.toString());      

    this.closeUpdateForm();
       
  }

  checkPassword() {

    if(this.updateForm.value.password === null){

      this.errorMessagePassword = "Please enter a password."
      this.boolPasswordError = true;

    } else {

      if(this.updateForm.value.password.length < 6) {

        this.errorMessagePassword = "Passwords must be at least 6 characters in length.";
        this.boolPasswordError = true;

      }else {

        if(this.updateForm.get('password')?.errors){ 

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
  
    if(this.updateForm.value.password !== null) {
      
      let boolGoodPassword: boolean = this.usersService.checkPasswordMatch(this.updateForm.value.password, this.updateForm.value.confirmPassword);

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

 
  clearForm() {
    this.updateForm.value.password = "";
    this.updateForm.value.confirmPassword = "";
    this.updateForm.value.firstName = "";
    this.updateForm.value.lastName = "";
  }
 
  closeUpdateForm(){

    this.boolShowForm = false;

    this.showUpdateForm.emit(this.boolShowForm);
         
    this.clearForm();
  }


  fillInUserDetails() {
     this.firstName = this.user.firstname;
     this.lastName = this.user.lastname;
  }  
  
  getUserDataFromArray(position: number, users: UserInterface[]){
    this.user.id = users[position].id;
    this.user.email = users[position].email;
    this.user.password = users[position].password,
    this.user.firstname = users[position].firstname;
    this.user.lastname = users[position].lastname;
    this.user.createdOn = users[position].createdOn;
  }


  getUserDetails() {         
   
    if(this.updateForm.value.password !== null) {
      this.user.password = this.updateForm.value.password;
    } 

    if(this.updateForm.value.firstName !== null) {    
      this.user.firstname = this.updateForm.value.firstName;
    }

    if(this.updateForm.value.lastName !== null) {
      this.user.lastname = this.updateForm.value.lastName;
    }    

  }

}


/* PATTERN */

// ("[^(?=[^\d_].*?\d)\w(\w|[!@#$%]){5,15}]")