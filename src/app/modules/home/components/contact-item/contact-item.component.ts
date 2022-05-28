import { Component, Input, OnInit } from '@angular/core';
import { Person } from 'src/app/shared/models/person.model';

@Component({
  selector: 'app-contact-item',
  templateUrl: './contact-item.component.html',
})
export class ContactItemComponent implements OnInit {
  @Input() person: Person;
  selectedPerson: Person;

  ngOnInit(): void {}
}
