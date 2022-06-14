import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @Input() boolLogin: boolean = false;

  @Output() userLogin: EventEmitter<boolean> = new EventEmitter(); 

  title = 'DashBoard_Project';

  setOpacity: boolean = false;

  showSideNav: boolean = false;
 
  updateLogin(loginValue: boolean) {
    this.boolLogin = loginValue;
    this.userLogin.emit(this.boolLogin);
  }

  setBackgroundOpacity(setBackgroundOpacity: boolean) {
    
    if(setBackgroundOpacity) {
      this.setOpacity = true;
    }else{      
      this.setOpacity = false;  
    }

  }
  
}

