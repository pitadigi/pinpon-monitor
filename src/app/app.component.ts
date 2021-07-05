import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import * as play from 'audio-play';
import * as load from 'audio-loader';
import { v4 as uuidv4 } from 'uuid';
import { ElectronService } from 'ngx-electron';
import * as mqtt from 'mqtt';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  /**
   * config情報
   */
  config: any;

  /**
   * タイトル
   */
  title = 'Pinpon Monitor';

  /**
   * motion url
   */
  safeMotionUrl: SafeResourceUrl;
  motionUrl: string;
  intervalId: any = null;

  /**
   * MQTT Client
   */
  mqttClient: any;

  constructor(
    private readonly domSanitizer: DomSanitizer,
    private readonly electronService: ElectronService,
  ) {
  }

  async ngOnInit() {
    this.config = await this.electronService.ipcRenderer.invoke('get-config', '');

    this.motionUrl = this.config.monitor.url;

    this.showMotion();

    this.refreshMotion();

    this.subscribe();
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
    this.mqttClient.unsubscribe(this.config.mqtt.topic);
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

  private subscribe() {
    const self = this;
    this.mqttClient = mqtt.connect(this.config.mqtt.broker);

    this.mqttClient.on('connect', () => {
      self.mqttClient.subscribe(self.config.mqtt.topic);   
    });

    this.mqttClient.on('message', (topic, message) => {
      if (topic === self.config.mqtt.topic
        && message.toString() === self.config.mqtt.message) {
          self.electronService.ipcRenderer.invoke('restore', '');
          self.showMotion();
          load('./assets/pinpon.wav').then(play);
        }
    });
  }
}
