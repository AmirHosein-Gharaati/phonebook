import { Component, OnInit } from '@angular/core';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  faMagnifyingGlass = faMagnifyingGlass;

  constructor() {}

  ngOnInit(): void {}
}
