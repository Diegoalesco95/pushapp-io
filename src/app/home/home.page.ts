import { ApplicationRef, Component, OnInit } from '@angular/core';
import { PushService } from 'src/app/services/push.service';
import { PushMessage } from '../interfaces';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  messages: PushMessage[] = [];

  constructor(
    private pushService: PushService,
    private applicationRef: ApplicationRef
  ) {}

  ngOnInit(): void {
    this.pushService.pushListener.subscribe((message) => {
      this.messages.unshift(message);
      this.applicationRef.tick();
    });
  }

  ionViewWillEnter() {
    this.messages = this.pushService.getMessages();
    console.log(this.messages);
  }

  deleteAll() {
    this.pushService.deleteMessages();
    this.messages = [];
  }
}
