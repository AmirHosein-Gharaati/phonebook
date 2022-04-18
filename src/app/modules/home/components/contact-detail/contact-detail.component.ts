import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ContactService } from 'src/app/core/services/contact.service';
import { Contact } from 'src/app/shared/models/contact.model';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
})
export class ContactDetailComponent implements OnInit, OnDestroy {
  selectedContact: Contact;
  selectedContactSubs: Subscription;

  constructor(private contactService: ContactService) { }

  ngOnInit(): void {
    this.selectedContactSubs = this.contactService.selectedContact.subscribe(
      (contact: Contact) => {
        this.selectedContact = contact;
      }
    );
  }

  ngOnDestroy(): void {
    this.selectedContactSubs.unsubscribe();
  }

}
