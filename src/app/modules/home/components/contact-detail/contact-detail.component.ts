import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService } from 'src/app/core/http/api.service';
import { PersonService } from 'src/app/core/services/person.service';
import { Person } from 'src/app/shared/models/person.model';
import { IMAGE_URLS } from 'src/app/shared/image-urls.model';
import { getProperImage } from 'src/app/shared/functions';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
})
export class ContactDetailComponent implements OnInit {
  selectedPerson: Person;
  personId: number;
  IMAGES = IMAGE_URLS;
  getProperImage = getProperImage;

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
