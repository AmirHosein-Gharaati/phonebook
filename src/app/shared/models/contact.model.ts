import { ControlData } from './control-data.model';

export interface Contact {
  id: number;
  imageURL: string;
  firstName: string;
  lastName: string;
  controlDatas: ControlData[];
}
