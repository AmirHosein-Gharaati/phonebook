import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ContactService } from 'src/app/core/services/contact.service';
import { Contact } from 'src/app/shared/models/contact.model';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
})
export class ContactDetailComponent implements OnInit {
  selectedContact: Contact;
  contactId: number;

  constructor(
    private contactService: ContactService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.contactId = +params['id'];
      try {
        this.selectedContact = this.contactService.getContact(this.contactId);
      } catch (error) {
        console.log('ERRORRRRR');

        this.router.navigate(['not-found']);
      }
    });
  }

  onDeleteContact() {
    this.contactService.deleteContact(this.contactId);
    this.router.navigate(['../']);
  }
}
