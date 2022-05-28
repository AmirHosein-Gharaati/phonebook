import { Pipe, PipeTransform } from '@angular/core';
import { Person } from '../models/person.model';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(items: Person[], searchText: string): Person[] {
    searchText = searchText.toLowerCase();

    return items.filter((person) => {
      const fullName = (person.firstName + ' ' + person.lastName).toLowerCase();
      return fullName.includes(searchText);
    });
  }
}
