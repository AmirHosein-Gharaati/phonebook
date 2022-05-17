import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contact } from 'src/app/shared/models/contact.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getContacts() {
    return this.http.get<Contact[]>('http://localhost:5000/api/contact');
  }

  findContact(id: number) {
    return this.http.get<Contact>(`http://localhost:5000/api/contact/${id}`);
  }

  addContact(contact: Contact) {
    return this.http.post<Contact>(
      `http://localhost:5000/api/contact`,
      contact
    );
  }

  updateContact(contact: Contact) {
    return this.http.put<Contact>(
      `http://localhost:5000/api/contact/${contact.id}`,
      contact
    );
  }

  deleteContact(id: number) {
    return this.http.delete(`http://localhost:5000/api/contact/${id}`);
  }
}
