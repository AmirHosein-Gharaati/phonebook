import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contact } from 'src/app/shared/models/contact.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl = 'http://localhost:5000/api';
  constructor(private http: HttpClient) {}

  getContacts() {
    return this.http.get<Contact[]>(`${this.baseUrl}/contact`);
  }

  findContact(id: number) {
    return this.http.get<Contact>(`${this.baseUrl}/contact/${id}`);
  }

  addContact(contact: Contact) {
    return this.http.post<Contact>(`${this.baseUrl}/api/contact`, contact);
  }

  updateContact(contact: Contact) {
    return this.http.put<Contact>(
      `${this.baseUrl}/api/contact/${contact.id}`,
      contact
    );
  }

  deleteContact(id: number) {
    return this.http.delete(`${this.baseUrl}/api/contact/${id}`);
  }
}
