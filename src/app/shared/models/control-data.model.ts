export enum CDCategories {
  PHONE_NUMBER = 'Phone Number',
  HOME_NUMBER = 'Home Number',
  EMAIL = 'Email',
}

export class ControlData {
  constructor(public category: string, public text: string) {}
}
