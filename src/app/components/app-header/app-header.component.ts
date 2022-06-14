import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { UsersService } from 'src/app/users.service';

@Component({
  selector: 'app-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit {

  @Input() loggedIn: boolean = false;

  @Input() loginForm: boolean = false;

  @Output() setOpacity = new EventEmitter<boolean>();

  loginLogout: string = "Login";

  firstName: string = "";

  showSubMenu: boolean = false;

  boolShowLoginForm: boolean = false;

  boolShowRegisterForm: boolean = false;

  boolShowUpdateForm: boolean = false;

  showLargeDisplay: boolean = false;

  showSmallDisplay: boolean = false;

  showSideNavMenu: boolean = false;

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
    this.checkDisplay();
  }  

  onResize() {
    this.checkDisplay();
  }

 
  checkLoginStatus() {
    this.loggedIn? this.loginLogout = "Logout" : this.loginLogout = "Login";    
  }

  showLoginForm() {
    this.boolShowLoginForm = true;
    this.setOpacity.emit(this.boolShowLoginForm);

    if(this.showSideNavMenu) {
      this.showSideNavMenu = false;
    }
  }

  onShowLogin(showForm: boolean) {   
    this.boolShowLoginForm = showForm;
    this.setOpacity.emit(this.boolShowLoginForm);
    this.showSubMenu = false;  
  } 
  
  showUserName(name: string) {
    name? this.firstName = name: this.firstName = ""; 
  }

  onShowRegister(showRegisterForm: boolean) {
    this.boolShowRegisterForm = showRegisterForm;
    this.setOpacity.emit(this.boolShowRegisterForm);    
    this.showSubMenu = false;    
  }

  onCloseRegister(showRegisterForm: boolean) {
    this.boolShowRegisterForm = showRegisterForm;   
    this.showSubMenu = false;  
  }

  updateAccount() {
    this.boolShowUpdateForm = true;  
    this.setOpacity.emit(this.boolShowUpdateForm);    
    this.showSideNavMenu = false;
  }

  onCloseUpdate(showUpdateForm: boolean) {
    this.boolShowUpdateForm = showUpdateForm;
    this.setOpacity.emit(this.boolShowUpdateForm);
    this.showSubMenu = false;
    
    if(this.showSideNavMenu) {
      this.showSideNavMenu = false;
    }
  }

  logoutUser(){
    this.loggedIn = false;
    //this.usersService.clearUser();
    this.checkLoginStatus();
    this.firstName = "";
  }
  
  checkDisplay() {
    if(window.innerWidth < 799){
      this.showLargeDisplay = false;
      this.showSmallDisplay = true;
    }else{
      this.showLargeDisplay = true;
      this.showSmallDisplay = false;
    }
  }

  updateLogin(boolLogin: boolean){

    this.loggedIn = boolLogin;
    
    this.checkLoginStatus();

  }

  /*** SIDENAV MENU ***/

  toggleSubMenu() {
    this.showSubMenu = !this.showSubMenu;  
  }

  openSideNavMenu() {
    this.showSideNavMenu = true;
   }

   closeSideNavMenu() {
    this.showSideNavMenu = false;
   }
 
}


