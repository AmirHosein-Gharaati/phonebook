import { Contact } from './contact.model';

export interface Person {
  personId: number;
  imageUrl: string;
  firstName: string;
  lastName: string;
  contact: Contact[];
}
