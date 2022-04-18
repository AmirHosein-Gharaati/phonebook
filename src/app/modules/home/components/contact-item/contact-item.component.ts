import { Component, Input, OnInit } from '@angular/core';
import { Contact } from 'src/app/shared/models/contact.model';

@Component({
  selector: 'app-contact-item',
  templateUrl: './contact-item.component.html',
})
export class ContactItemComponent implements OnInit {
  @Input() contact: Contact;

  constructor() { }

  ngOnInit(): void {
    
  }

}
