import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { UserInterface } from './user-interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      Authorization: ''// 'my-auth-token'
    })
  };
  
  userLoggedIn: Boolean = false;

  logInMessage: String = "";

  users: UserInterface[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  baseURL: String = this.router.url;
  
 /* getUserHttp$ = this.http.get(`${this.baseURL}/assets/users.json`);*/
 
  usersJSONURL = "http://localhost:4200/assets/fake.json";

  jsonServer = "http://localhost:3000/users"

  getUsersDatabase(): Observable<UserInterface[]> {
   
    return this.http.get<UserInterface[]>(this.jsonServer) 
      .pipe(
        catchError(error => {
          alert(error);
          return throwError(error);
        })
      )

  }

  addNewUser(user: UserInterface): Observable<UserInterface>  {
        
    return this.http.post<UserInterface>(this.jsonServer, user, this.httpOptions)
      .pipe(
        catchError(error => {
          alert(error);
          return throwError(error);
        })
      );
    
    }

  updateUser(user: UserInterface): Observable<UserInterface> {

    const url = this.jsonServer + "/" + user.id;

    let rememberMe: boolean = Boolean(this.getRememberMeValue());
        
    this.setUser(user, rememberMe);

    return this.http.put<UserInterface>(url, user, this.httpOptions)
    .pipe(
      catchError(error => {
        alert(error);
        return throwError(error);
      })
    );   

  } 

  deleteUser(user: UserInterface): Observable <unknown>{   

    const url = `${this.jsonServer}/${user.id}`; 

    return this.http.delete(url, this.httpOptions)
      .pipe(
        catchError(error => {
          alert(error);
          return throwError(error);
        })
      );

  }     

  getUserPositonFromID(userID: number, users: UserInterface[]): number {

    let position: number = users.findIndex(user => user.id === userID); 

    return position;

  }
  
  getUserPositionFromEmail(email: string, users: UserInterface[]): number {
    
     let position: number = users.findIndex(user => user.email === email); 
 
     return position;
 
   }

  checkForExistingUser(email: string, users: UserInterface[]): boolean {
        
    let boolNewUser: boolean = true; 
      
    for (let i = 0; i < users.length; i++){
      
      if(email === users[i].email){
        boolNewUser = false;
        break;
      }            

    }

    return boolNewUser;
    
  }   

  checkUserLogin(userEmail: string, userPassword: string, users: UserInterface[], rememberMe: boolean) {
      
    let boolFound: boolean = false;
   
    for(let i = 0; i < users.length; i++){

      if(userEmail === users[i].email){  

        if(userPassword === users[i].password) {

          boolFound = true;

          this.setUser(users[i], rememberMe);

          break;

        }

      }
       
    }

    return boolFound;  
    
  }

  checkPasswordMatch(password: string, confirmedPassword: string): boolean {

    let boolConfirmPassword: boolean = false;

    if(password === confirmedPassword) {
      boolConfirmPassword = true;     
    }

    return boolConfirmPassword;
    
  }

  /*** LOCAL STORAGE USER DATA ***/

  public getRememberMeValue() {
    let values = this.getUser();
    
    let rememberMe: boolean = false;

    if(values) {
      rememberMe = Boolean(values[0]);
    }

    return rememberMe;

  }

  public getEmail() {

    let values = this.getUser();

    let email: string = "";

    if(values) {
      email = values[2];
    }

    return email;

  }

  public getUser() {
  
    let userData = localStorage.getItem('user')?.split(',');
  
    return userData; 

  }

  private setUser(user: UserInterface, rememberMe: boolean): void {

    let userData: string[]  = [ rememberMe.toString(), user.id.toString(), user.email, user.firstname ];

    localStorage.setItem('user', userData.toString());
  }

  public clearUser(): void {
    localStorage.clear();
  }

}
