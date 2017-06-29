import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';
import { ListStationPage } from '../list-station';
import * as moment from 'moment';

@IonicPage()
@Component({
	selector: 'page-stay-time-count-down',
	templateUrl: 'stay-time-count-down.html',
})
export class StayTimeCountDownPage extends BaseComponent {

    station: any;
    nextStation: any;
    duration: number;
    countDownTimer: any;
    isStarted: boolean = false;

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams) {
        super(injector);
        this.station = this.navParams.data.station;
        this.duration = Number(this.navParams.data.station.stop_time);
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad StayTimeCountDownPage');
	}

    chooseNextStation() {
        let params = {
            currentStation: this.station,
            isSelectNextStationMode: true
        }
        this.navCtrl.push(ListStationPage, params);
    }

    displayDuration(duration: number): string {
		return moment(duration * 1000).format('mm:ss');
	}

    startCountDown() {
        this.isStarted = true;
        this.countDownTimer = setInterval(() => {
            this.duration--;
            if (this.duration == 0) {
                clearInterval(this.countDownTimer);
            }
        }, 1000);
    }

}
