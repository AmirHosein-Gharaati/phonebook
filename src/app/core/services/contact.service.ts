import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Contact } from 'src/app/shared/models/contact.model';
import { CDCategories } from 'src/app/shared/models/control-data.model';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  contactsChanged = new Subject<Contact[]>();

  private contacts: Contact[] = [
    // {
    //   id: 1,
    //   imageURL:
    //     'https://raw.githubusercontent.com/AmirHosein-Gharaati/portfolio/master/src/assets/images/me.png',
    //   firstName: 'Amirhosein',
    //   lastName: 'Gharaati',
    //   controlDatas: [
    //     {
    //       category: CDCategories.PHONE_NUMBER,
    //       text: '9365723124',
    //     },
    //   ],
    // },
    // {
    //   id: 2,
    //   imageURL: '../../../assets/images/rouholah.jpg',
    //   firstName: 'Rouholah',
    //   lastName: 'Mahjoub',
    //   controlDatas: [
    //     {
    //       category: CDCategories.PHONE_NUMBER,
    //       text: '9176543210',
    //     },
    //   ],
    // },
  ];

  constructor(private http: HttpClient) {}

  getContacts() {
    this.http
      .get<Contact[]>('http://localhost:5000/api/contact')
      .subscribe((data: Contact[]) => {
        this.contacts = data;
        this.contactsChanged.next(this.contacts.slice());
      });
  }

  getContact(id: number): Contact {
    const item: Array<Contact> = this.contacts.filter(
      (contact) => contact.id === id
    );
    if (item.length) {
      return item[0];
    } else {
      throw new Error('No contact found with this id: ' + id);
    }
  }

  getIndex(id: number) {
    for (let index in this.contacts) {
      const contact = this.contacts[index];
      if (contact.id === id) return +index;
    }

    throw new Error('Not Found!');
  }

  getLength(): number {
    return this.contacts.length;
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

  fetchValidImageURL(url: string) {
    return this.http.get(url, { responseType: 'blob' });
  }
}
