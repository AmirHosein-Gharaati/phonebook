export enum Categories {
  PHONE_NUMBER = 0,
  HOME_NUMBER = 1,
  EMAIL = 2,
}

export interface Contact {
  contactId: number;
  personRef: number;
  type: number;
  value: string;
}
