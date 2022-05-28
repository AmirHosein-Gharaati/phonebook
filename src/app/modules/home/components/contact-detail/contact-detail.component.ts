import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { ContactService } from 'src/app/core/services/contact.service';
import { Contact } from 'src/app/shared/models/person.model';
import { Categories } from 'src/app/shared/models/contact.model';
import { ApiService } from 'src/app/core/http/api.service';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
})
export class ContactDetailComponent implements OnInit {
  selectedContact: Contact;
  contactId: number;
  categories = Categories;

  constructor(
    private contactService: ContactService,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.contactId = +params['id'];
      this.apiService.findContact(this.contactId).subscribe({
        next: (contact: Contact) => {
          this.selectedContact = contact;
        },
        error: (error) => {
          this.router.navigate(['not-found']);
        },
      });
    });
  }

  onDeleteContact() {
    this.contactService.deleteContact(this.contactId);
    this.router.navigate(['../']);
  }
}
