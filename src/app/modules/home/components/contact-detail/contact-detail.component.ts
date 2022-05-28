import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService } from 'src/app/core/http/api.service';
import { PersonService } from 'src/app/core/services/person.service';
import { Categories } from 'src/app/shared/models/contact.model';
import { Person } from 'src/app/shared/models/person.model';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
})
export class PersonDetailComponent implements OnInit {
  selectedPerson: Person;
  personId: number;
  categories = Categories;

  constructor(
    private personService: PersonService,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.personId = +params['id'];
      this.apiService.findPerson(this.personId).subscribe({
        next: (person: Person) => {
          this.selectedPerson = person;
        },
        error: (error) => {
          this.router.navigate(['not-found']);
        },
      });
    });
  }

  onDeletePerson() {
    this.personService.deletePerson(this.personId);
    this.router.navigate(['../']);
  }
}
