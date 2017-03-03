import { version } from '../package.json';
import rbush from 'rbush';
import { UI } from './ui/ui';

export class cmap {

  constructor() {
    this.version = version;
    this.ui = new UI();
  }

  init() {
    this.ui.init();
  }
}
