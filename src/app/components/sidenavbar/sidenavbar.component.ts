import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidenavbar',
  templateUrl: './sidenavbar.component.html',
  styleUrls: ['./sidenavbar.component.scss']
})
export class SideNavBarComponent implements OnInit {

  showSideNav: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.checkDisplay();
  }

  onResize(){
    this.checkDisplay();
  }

  checkDisplay(){
    if(window.innerWidth < 799) {
      this.showSideNav = false;
    }else{
      this.showSideNav = true;
    }
  }

}
