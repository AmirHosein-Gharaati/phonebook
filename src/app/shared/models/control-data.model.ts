export enum CDCategories {
  PHONE_NUMBER = 'Phone Number',
  HOME_NUMBER = 'Home Number',
  EMAIL = 'Email',
}

export interface ControlData {
  category: string;
  text: string;
}
