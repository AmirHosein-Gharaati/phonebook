import { Contact } from './contact.model';

export interface PersonPost {
  imageUrl: string;
  firstName: string;
  lastName: string;
  contact: Contact[];
}

export interface Person extends PersonPost {
  personId: number;
}
