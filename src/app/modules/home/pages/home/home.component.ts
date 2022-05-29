import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import { PersonService } from 'src/app/core/services/person.service';
import { Person } from 'src/app/shared/models/person.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  faMagnifyingGlass = faMagnifyingGlass;
  persons: Person[] = [];
  personsSubscription: Subscription;
  searchInputSubscription: Subscription;
  searchText = '';

  constructor(private personService: PersonService) {}

  ngOnInit(): void {
    this.personService.getPersons().subscribe((data) => {
      this.persons = data;
    });

    this.searchInputSubscription = fromEvent(
      this.searchInput.nativeElement,
      'keyup'
    )
      .pipe(
        map((event: any) => {
          return event.target.value;
        }),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((text: string) => {
        this.searchText = text;
      });
  }

  ngOnDestroy(): void {
    this.searchInputSubscription.unsubscribe();
  }
}
