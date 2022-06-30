import { EventEmitter, Injectable } from '@angular/core';
import OneSignal from 'onesignal-cordova-plugin';
import { OSNotification } from 'onesignal-cordova-plugin/types/Notification';
// import { OSNotification } from '@awesome-cordova-plugins/onesignal';

import { Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';

import { PushMessage } from 'src/app/interfaces';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class PushService {
  messages: PushMessage[] = [];
  pushListener = new EventEmitter<PushMessage>();

  constructor(
    private platform: Platform,
    private storageService: StorageService
  ) {
    this.loadMessages();
  }

  getMessages() {
    this.loadMessages();
    return [...this.messages];
  }

  init() {
    this.platform.ready().then(() => {
      this.oneSignalInit();
    });
  }

  oneSignalInit() {
    OneSignal.setAppId(environment.oneSignalAppId);

    OneSignal.setNotificationWillShowInForegroundHandler(
      async (notificationReceivedEvent) => {
        this.onMessageReceived(notificationReceivedEvent.getNotification());
      }
    );

    OneSignal.setNotificationOpenedHandler(async (notification) => {
      this.onMessageReceived(notification.notification);
    });
  }

  onMessageReceived(notification: OSNotification) {
    const { additionalData, body, notificationId, title } = notification;

    const pushExists = this.messages.find(
      (message) => message.notificationId === notificationId
    );

    const newNotification = {
      notificationId,
      title,
      body,
      date: new Date(),
      additionalData,
    };

    if (!pushExists) {
      this.messages = [newNotification, ...this.messages];
    }

    this.saveMessages();
    this.pushListener.emit(newNotification);
  }

  loadMessages() {
    this.storageService.loadPushMessages().then((messages) => {
      this.messages = messages;
    });
  }

  saveMessages() {
    this.storageService.savePushMessage(this.messages);
  }

  deleteMessages() {
    this.storageService.deletePushMessages();
  }
}
