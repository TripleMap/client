import { Component, ChangeDetectorRef, AfterViewInit } from '@angular/core';

import { AuthService } from '../../auth/auth-service'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
@Component({
  selector: 'tdmap-sistem',
  templateUrl: './tdmap-sistem.component.html',
  styleUrls: ['./tdmap-sistem.component.css']
})
export class TdmapSistem implements AfterViewInit {

  public activeMediaQuery = "";
  public isFilterSidenavActive: boolean = false;
  public isAttributeTableActive: boolean = false;
  public isAttributeItemActive: boolean = false;
  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public AuthService: AuthService
  ) { }

  ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  toggleFilterSideNav(): void {
    this.isFilterSidenavActive = !this.isFilterSidenavActive;
  }

  toggleTDMapPanel(): void {
    this.isAttributeTableActive = !this.isAttributeTableActive;
  }

  toggleTDMapItemPanel(): void {
    this.isAttributeItemActive = !this.isAttributeItemActive;
  }
  logout() {
    this.AuthService.logout();
  }
}
