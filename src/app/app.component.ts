import { Component, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import { MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import * as play from 'audio-play';
import * as load from 'audio-loader';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  private subscription: Subscription;

  /**
   * タイトル
   */
  title = 'Pinpon Monitor';

  /**
   * motion url
   */
  safeMotionUrl: SafeResourceUrl;
  motionUrl: string = 'http://192.168.1.200:8081';

  constructor(
    private readonly domSanitizer: DomSanitizer,
    private readonly mqttService: MqttService,
  ) {
    this.safeMotionUrl = domSanitizer.bypassSecurityTrustResourceUrl(this.motionUrl);

    this.subscription = this.mqttService.observe('pinpon').subscribe((message) => {
      load('./assets/pinpon.wav').then(play);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  handleClose() {
    window.close();
  }
}
