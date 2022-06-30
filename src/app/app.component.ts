import { Component } from '@angular/core';

import { PushService } from 'src/app/services/push.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private pushService: PushService) {
    this.initApp();
  }

  initApp() {
    this.pushService.init();
  }
}
