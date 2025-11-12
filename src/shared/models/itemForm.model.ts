import { FormControl } from '@angular/forms';
import { Killstreaker } from './killstreaker.model';

export interface ItemForm {
  name: FormControl<string>;
  quality: FormControl<string[]>;
  effect: FormControl<string>;
  killstreaker: FormControl<Killstreaker>;
  craftable: FormControl<boolean>;
}
