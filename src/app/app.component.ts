import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import { MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import * as play from 'audio-play';
import * as load from 'audio-loader';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
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
  intervalId: any = null;

  constructor(
    private readonly domSanitizer: DomSanitizer,
    private readonly mqttService: MqttService,
  ) {
  }

  ngOnInit() {
    this.showMotion();

    this.refreshMotion();
    
    this.subscription = this.mqttService.observe('pinpon').subscribe((message) => {
      this.showMotion();
      load('./assets/pinpon.wav').then(play);
    });
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
    this.subscription.unsubscribe();
  }

  private refreshMotion() {
    const self = this;
    this.intervalId = setInterval(() => {
      self.showMotion();
    }, 1 * 60 * 1000);
  }

  private showMotion() {
    const url: string = `${this.motionUrl}?id=${uuidv4()}`;
    this.safeMotionUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(url);
}

  handleClose() {
    window.close();
  }
}
