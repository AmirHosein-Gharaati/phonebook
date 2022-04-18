import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import { ContactService } from 'src/app/core/services/contact.service';
import { Contact } from 'src/app/shared/models/contact.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  faMagnifyingGlass = faMagnifyingGlass;
  contacts: Contact[] = [];
  contactsSubscription: Subscription; // ?

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.contactsSubscription = this.contactService.contactsChanged.subscribe(
      (contacts: Contact[]) => {
        this.contacts = contacts;
      }
    );

    this.contacts = this.contactService.getContacts();
    console.log(this.contacts);
  }

  ngOnDestroy(): void {
    this.contactsSubscription.unsubscribe();
  }
}
