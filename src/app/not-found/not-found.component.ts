import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css'],
  host: {
    class: 'dark-theme'
  }
})
export class NotFound implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {

  }
  back() {
    this.router.navigate(['tdmap']);
  }
}
