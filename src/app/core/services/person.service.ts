import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Person } from 'src/app/shared/models/person.model';
import { ApiService } from '../http/api.service';

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  personsChanged = new Subject<Person[]>();

  private persons: Person[] = [];

  constructor(private apiService: ApiService, private http: HttpClient) {}

  getPersons() {
    return this.apiService.getPersons().pipe(
      tap((p) => {
        this.persons = p;
      })
    );
  }

  getPerson(id: number): Person {
    const item = this.persons.find((person) => person.personId === id);
    if (!item) {
      throw new Error('No person found with this id: ' + id);
    }
    return item;
  }

  getIndex(id: number) {
    const index = this.persons.findIndex((p) => p.personId === id);
    if (index === -1) {
      throw new Error('Not Found!');
    }
    return index;
  }

  addPerson(person: Person) {
    const { personId, ...personPost } = person;

    this.apiService.addPerson(personPost).subscribe((data) => {
      this.persons.push(data);
      this.personsChanged.next(this.persons.slice());
    });
  }

  updateConact(newPerson: Person) {
    const id = newPerson.personId;
    const person = this.getPerson(id);
    if (!person) throw new Error('ID number is incorrect!');

    this.apiService.updatePerson(newPerson).subscribe();

    const index = this.getIndex(person.personId);
    this.persons[index] = newPerson;
    this.personsChanged.next(this.persons.slice());
  }

  deletePerson(id: number) {
    const person = this.getPerson(id);
    if (!person) throw new Error('ID number is incorrect!');

    this.apiService.deletePerson(person.personId).subscribe();

    const index = this.getIndex(person.personId);
    this.persons.splice(index, 1);
    this.personsChanged.next(this.persons.slice());
  }

  fetchValidImageURL(url: string) {
    return this.http.get(url, { responseType: 'blob' });
  }
}
