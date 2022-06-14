import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

    constructor(private http: HttpClient) {}

    createLinkToResetPassword(email: string): string {

      const params = new HttpParams()
        .set('email', email);

        let url: string = "http://localhost:4200/reset-password/?" + params; 
    
      return url;

    }

    openResetPasswordForm(url: string): void{
      window.open(url);
    }

    getEmailAddressFromURL(url: string): string {
      
      let start:number = url.indexOf('?') + 7;

      let length:number = url.length;
  
      let email:string = url.substring(start, length); 

      return email;
  
    }

}