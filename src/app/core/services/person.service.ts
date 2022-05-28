import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Person, PersonPost } from 'src/app/shared/models/person.model';
import { ApiService } from '../http/api.service';

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  personsChanged = new Subject<Person[]>();

  private persons: Person[] = [];

  constructor(private apiService: ApiService, private http: HttpClient) {}

  getPersons() {
    this.apiService.getPersons().subscribe((data: Person[]) => {
      this.persons = data;
      this.personsChanged.next(this.persons.slice());
    });
  }

  getPerson(id: number): Person {
    const item: Array<Person> = this.persons.filter(
      (person) => person.personId === id
    );
    if (item.length) {
      return item[0];
    } else {
      throw new Error('No person found with this id: ' + id);
    }
  }

  getIndex(id: number) {
    for (let index in this.persons) {
      const person = this.persons[index];
      if (person.personId === id) return +index;
    }

    throw new Error('Not Found!');
  }

  getLength(): number {
    return this.persons.length;
  }

  addPerson(person: Person) {
    const {personId, ...personPost} = person;
    
    this.apiService.addPerson(personPost).subscribe(data => {
      this.persons.push(data);
    });
    this.personsChanged.next(this.persons.slice());
  }

  updateConact(newPerson: Person) {
    const id = newPerson.personId;
    const person = this.getPerson(id);
    if (!person) throw new Error('ID number is incorrect!');

    const index = this.getIndex(person.personId);
    this.persons[index] = newPerson;
    
    this.apiService.updatePerson(newPerson).subscribe();
    this.personsChanged.next(this.persons.slice());
  }

  deletePerson(id: number) {
    const person = this.getPerson(id);
    if (!person) throw new Error('ID number is incorrect!');

    const index = this.getIndex(person.personId);
    this.persons.splice(index, 1);
    this.apiService.deletePerson(person.personId).subscribe();
    this.personsChanged.next(this.persons.slice());
  }

  fetchValidImageURL(url: string) {
    return this.http.get(url, { responseType: 'blob' });
  }
}
