/**
 * CorrespondenceStores
 * MobexStore for managing correspondence lines between two maps..
 */

import { makeObservable, observable, computed, action} from 'mobx';

export default class CorrespondenceStore {
  constructor() {
    makeObservable(this, {
      observedItem: observable,
      computedItem: computed,
      actionItem: action,
    });
  }

  observedItem = '';

  get computedItem(){
    return 'poo';
  }

  actionItem(stuff){
    this.observedItem = stuff;
  }
}
