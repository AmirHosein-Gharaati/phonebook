import { Pipe, PipeTransform } from '@angular/core';
import { Contact } from '../models/contact.model';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(items: Contact[], searchText: string): Contact[] {
    searchText = searchText.toLowerCase();

    return items.filter((contact) => {
      const fullName = (contact.firstName + ' ' + contact.lastName).toLowerCase();
      return fullName.includes(searchText);
    });
  }
}
