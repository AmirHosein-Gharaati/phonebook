import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Contact } from 'src/app/shared/models/contact.model';
import {
  ControlData,
  CDCategories,
} from 'src/app/shared/models/control-data.model';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  contactsChanged = new Subject<Contact[]>();

  private contacts: Contact[] = [
    new Contact(
      1,
      'https://raw.githubusercontent.com/AmirHosein-Gharaati/portfolio/master/src/assets/images/me.png',
      'Amirhosein',
      'Gharaati',
      [new ControlData(CDCategories.PHONE_NUMBER, '+98 936 572 31 24')]
    ),
    new Contact(
      2,
      'https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png',
      'Rouholah',
      'Mahjoub',
      [new ControlData(CDCategories.PHONE_NUMBER, '+98 917 654 32 10')]
    ),
  ];

  constructor() {}

  getContacts(): Contact[] {
    return this.contacts.slice();
  }

  getContact(id: number): Contact {
    const item: Array<Contact> = this.contacts.filter(
      (contact, i) => contact.id === id
    );
    if (item.length) {
      return item[0];
    } else {
      throw new Error('Not Found!');
    }
  }

  getIndex(id: number): number {
    this.contacts.forEach((contact, index) => {
      if (contact.id === id) return index;
      return;
    });
    return -1;
  }

  addContact(contact: Contact) {
    this.contacts.push(contact);
    this.contactsChanged.next(this.contacts.slice());
  }

  updateConact(id: number, newContact: Contact) {
    const contact = this.getContact(id);
    if (!contact) throw new Error('ID number is incorrect!');

    const index = this.getIndex(contact.id);
    this.contacts[index] = newContact;
    this.contactsChanged.next(this.contacts.slice());
  }

  deleteContact(id: number) {
    const contact = this.getContact(id);
    if (!contact) throw new Error('ID number is incorrect!');

    const index = this.getIndex(contact.id);
    this.contacts.splice(index, 1);
    this.contactsChanged.next(this.contacts.slice());
  }
}
