import { Component, Input, OnInit } from '@angular/core';
import { ContactService } from 'src/app/core/services/contact.service';
import { Contact } from 'src/app/shared/models/contact.model';

@Component({
  selector: 'app-contact-item',
  templateUrl: './contact-item.component.html',
})
export class ContactItemComponent implements OnInit {
  @Input() contact: Contact;
  selectedContact: Contact;

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {}

  onSelectContact() {
    this.contactService.selectedContact.next(this.contact);
  }
}
