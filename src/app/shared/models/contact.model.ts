export enum Categories {
  PHONE_NUMBER = 'Phone Number',
  HOME_NUMBER = 'Home Number',
  EMAIL = 'Email',
}

export interface Contact {
  contactId: number;
  personRef: number;
  type: string;
  value: string;
}
