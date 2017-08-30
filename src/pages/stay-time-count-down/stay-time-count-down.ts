import { Component, Injector, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';
import { AppConstant } from '../../app/app.constant';

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
	timeMask = [/[0-2]/, /\d/, ':', /[0-6]/, /\d/, ':', /[0-6]/, /\d/];

	@ViewChild(Navbar) navBar: Navbar;

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams, private collectionModeService: CollectionModeService) {
        super(injector);
        this.station = this.navParams.data.station;
        this.duration = Number(this.navParams.data.station.stop_time);
		this.subcribeChooseNextStationEvent();
	}

	ionViewDidLoad() {
		this.log('ionViewDidLoad StayTimeCountDownPage');
		this.customBackButtonClick();
	}

	ionViewWillEnter() {
		this.log('ionViewWillEnter TakePicturePage');
		this.registerBackButtonAction();
	}

	registerBackButtonAction() {
		this.dataShare.setBackButtonAction(() => {
			if (this.isStarted) {
				return;
			}
			this.backButtonAction();
		});
	}

	backButtonAction() {
		if (!this.isShowingNextStationInfo) {
			this.navCtrl.pop();
		} else {
			this.navCtrl.popToRoot();
		}
	}

	subcribeChooseNextStationEvent() {
		this.events.subscribe(AppConstant.EVENT_TOPIC.COLLECTION_NEXTSTATION, (data) => {
			if (this.isDestroyed) {
				return;
			}
			this.handleChooseNextStationEvent(data);
		});
	}

	handleChooseNextStationEvent(data: any) {
		if (this.nextStation && this.nextStation.id == data.nextStation.id) {
			return;
		}
		if (this.isStarted || this.isShowingNextStationInfo) {
			this.updateStation(data.nextStation, () => {
				this.nextStation = data.nextStation;
			});
		} else {
			this.nextStation = data.nextStation;
		}
	}

	customBackButtonClick() {
		this.navBar.backButtonClick = (e: UIEvent) => {
			this.backButtonAction();
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
		return moment().startOf('day').add(duration, 'seconds').format('HH:mm:ss');
	}

	increaseOneMinute() {
		this.duration += MINUTE_TO_SECOND;
		if (this.isStarted) {
			this.updateParkingTime();
			if (!this.countDownTimer) {
				this.startCountDown();
			}
		}
	}

	decreaseOneMinute() {
		if (this.duration > MINUTE_TO_SECOND) {
			this.duration -= MINUTE_TO_SECOND;
			if (this.isStarted) this.updateParkingTime();
		} else {
			this.duration = 0;
			this.clearCountDownTimer();
		}
	}

	updateStation(nextStation?: any, callback?: () => void) {
		let currentStationId = this.isShowingNextStationInfo ? null : this.station.id;
		if (!nextStation) {
			nextStation = this.nextStation;
		}
		let nextStationId = nextStation.id;
		let stayTime = this.duration;

		this.collectionModeService.updateStation(currentStationId, nextStationId, stayTime).subscribe(
			res => {
				if (!this.isStarted && !this.isShowingNextStationInfo) {
					this.startCountDown();
				}
				if (callback) {
					callback();
				}
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
                this.clearCountDownTimer();
            }
        }, 1000);
    }

	clearCountDownTimer() {
		if (this.countDownTimer) {
			clearInterval(this.countDownTimer);
			this.countDownTimer = null;
		}
	}

	manualChangeParkingTime(event) {
		let formatString = '00:00:00';
		let durationString = event.target.value;
		if (durationString.length == formatString.length) {
			let duration = moment.duration(durationString).asSeconds();
			if (durationString != formatString && duration != 0) {
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
		this.events.publish(AppConstant.EVENT_TOPIC.DIRECTION_STATION, { station: this.nextStation });
		this.navCtrl.pop();
	}

}
