export enum CDCategories {
  PHONE_NUMBER = 'phone_number',
  HOME_NUMBER = 'home_number',
  EMAIL = 'email',
}

export class ControlData {
  constructor(public category: string, public text: string) {}
}
