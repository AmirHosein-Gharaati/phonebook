import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    searchText = searchText.toLowerCase();

    return items.filter((item) => {
      if (item.firstName && item.lastName) {
        const fullName = (item.firstName + ' ' + item.lastName).toLowerCase();
        return fullName.includes(searchText);
      }
      return false;
    });
  }
}
