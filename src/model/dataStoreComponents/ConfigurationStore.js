/**
 * ConfigurationStore
 * MobexStore for managing configuration settings.
 *
 */
//TODO: allow YAML coddiguration

import { makeObservable, observable, computed, action} from 'mobx';

export default class ConfigurationStore {
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