import { ControlData } from './control-data.model';

export class Contact {
  constructor(
    public id: number,
    public imageURL: string,
    public firstName: string,
    public lastName: string,
    public controlDatas: ControlData[]
  ) {}
}
