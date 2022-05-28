import { Categories } from 'src/app/shared/models/contact.model';
import { IMAGE_URLS } from 'src/app/shared/image-urls.model';

export function getProperImage(categoryType: string | number) {
  const type = Number(categoryType) as Categories;

  switch (type) {
    case Categories.PHONE_NUMBER:
      return IMAGE_URLS.PHONE;
    case Categories.HOME_NUMBER:
      return IMAGE_URLS.HOME;
    case Categories.EMAIL:
      return IMAGE_URLS.EMAIL;
    default:
      return IMAGE_URLS.DEFAULT;
  }
}
