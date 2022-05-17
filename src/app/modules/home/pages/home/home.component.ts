import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import { ContactService } from 'src/app/core/services/contact.service';
import { Contact } from 'src/app/shared/models/contact.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  faMagnifyingGlass = faMagnifyingGlass;
  contacts: Contact[] = [];
  contactsSubscription: Subscription;
  searchInputSubscription: Subscription;
  searchText = '';

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.contactsSubscription = this.contactService.contactsChanged.subscribe(
      (contacts: Contact[]) => {
        this.contacts = contacts;
      }
    );
    console.log('Hello');
    

    this.contactService.getContacts();

    this.searchInputSubscription = fromEvent(
      this.searchInput.nativeElement,
      'keyup'
    )
      .pipe(
        map((event: any) => {
          return event.target.value;
        }),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((text: string) => {
        this.searchText = text;
      });
  }

  ngOnDestroy(): void {
    this.contactsSubscription.unsubscribe();
    this.searchInputSubscription.unsubscribe();
  }
}
