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
}
