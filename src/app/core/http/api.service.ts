import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Person } from 'src/app/shared/models/person.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl = 'http://localhost:5000/api';
  constructor(private http: HttpClient) {}

  getPersons() {
    return this.http.get<Person[]>(`${this.baseUrl}/person`);
  }

  findPerson(id: number) {
    return this.http.get<Person>(`${this.baseUrl}/person/${id}`);
  }

  addPerson(person: Person) {
    return this.http.post<Person>(`${this.baseUrl}/person`, person);
  }

  updatePerson(person: Person) {
    return this.http.put<Person>(
      `${this.baseUrl}/person/${person.personId}`,
      person
    );
  }

  deletePerson(id: number) {
    return this.http.delete(`${this.baseUrl}/person/${id}`);
  }
}
