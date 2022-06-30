import { Injectable } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { PushMessage } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private localStorage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    this.localStorage = await this.storage.create();
  }

  async loadPushMessages() {
    try {
      return (await this.storage.get('pushMessages')) || [];
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  savePushMessage(pushMessages: PushMessage[]) {
    this.localStorage.set('pushMessages', pushMessages);
  }

  deletePushMessages() {
    this.localStorage.remove('pushMessages');
  }
}
