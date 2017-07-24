import { Component, Injector, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Navbar } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';
import { ListStationPage } from '../list-station';
import { CollectionModeService } from '../../app/services/collection-mode';
import * as moment from 'moment';

var MINUTE_TO_SECOND = 60;

@IonicPage()
@Component({
	selector: 'page-stay-time-count-down',
	templateUrl: 'stay-time-count-down.html',
	providers: [CollectionModeService]
})
export class StayTimeCountDownPage extends BaseComponent {

    station: any;
    nextStation: any;
    duration: number;
    durationString: string;
    countDownTimer: any;
    isStarted: boolean = false;
	isShowingNextStationInfo: boolean = false;

	@ViewChild(Navbar) navBar: Navbar;

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams, public events: Events, private collectionModeService: CollectionModeService) {
        super(injector);
        this.station = this.navParams.data.station;
        this.duration = Number(this.navParams.data.station.stop_time);
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad StayTimeCountDownPage');
		this.customBackButtonClick();
		this.events.subscribe('collection:nextStation', (data) => {
			this.nextStation = data.nextStation;
		});
	}

	customBackButtonClick() {
		this.navBar.backButtonClick = (e: UIEvent) => {
			if (!this.isShowingNextStationInfo) {
				this.navCtrl.pop();
			} else {
				this.navCtrl.popToRoot();
			}
		};
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

	increaseOneMinute() {
		this.duration += MINUTE_TO_SECOND;
		if (this.isStarted) this.updateParkingTime();
	}

	decreaseOneMinute() {
		if (this.duration >= MINUTE_TO_SECOND) {
			this.duration -= MINUTE_TO_SECOND;
		} else {
			this.duration = 0;
		}
		if (this.isStarted) this.updateParkingTime();
	}

	updateStation() {
		let currentStationId = this.station.id;
		let nextStationId = this.nextStation.id;
		let stayTime = this.duration;

		this.collectionModeService.updateStation(currentStationId, nextStationId, stayTime).subscribe(
			res => {
				this.startCountDown();
			},
			err => {
				this.showError(err.message);
			}
		);
	}

	updateParkingTime() {
		this.collectionModeService.updateParkingTime(this.duration).subscribe(
			res => {

			},
			err => {
				this.showError(err.message);
			}
		);
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

	manualChangeParkingTime(event) {
		if (event.length == 5) {
			let durationString = '00:' + event;
			let duration = moment.duration(durationString).asSeconds();
			if (durationString != '00:00:00' && duration != 0) {
				this.duration = duration;
			}
		}
	}

	leaveCurrentStation() {
		this.collectionModeService.leaveCurrentStation().subscribe(
			res => {
				this.isStarted = false;
				this.isShowingNextStationInfo = true;
			},
			err => {
				this.showError(err.message);
			}
		)
	}

	goBackToListStationPage() {
		let currentPageIndex = this.navCtrl.getViews().length - 1;
        let listStationPageIndex = currentPageIndex - 2;
        this.navCtrl.popTo(this.navCtrl.getByIndex(listStationPageIndex));
	}

	goToNextStation() {
		this.events.publish('direction:station', { station: this.nextStation });
		this.navCtrl.pop();
	}

}
