import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';
import { DirectionStopPage } from '../direction-stop';
import { CollectionModeService } from '../../app/services/collection-mode';

@IonicPage()
@Component({
	selector: 'page-list-station',
	templateUrl: 'list-station.html',
	providers: [CollectionModeService]
})
export class ListStationPage extends BaseComponent {

    listStation: Array<any> = [];
	isSelectNextStationMode: boolean = false;

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams, private collectionModeService: CollectionModeService) {
		super(injector);
		if (navParams.data.isSelectNextStationMode) {
			this.isSelectNextStationMode = true;
		}

		if (this.isSelectNextStationMode) {
			let currentStation = navParams.data.currentStation;
			this.removeCurrentStationInList(currentStation);
		}
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ListStationPage');
		this.loadListStation();
	}

	removeCurrentStationInList(currentStation: any) {
		let index = this.indexOfStationInList(currentStation);
		this.listStation.splice(index, 1);
	}

	indexOfStationInList(station: any) {
		for (let i = 0; i < this.listStation.length; i++) {
			if (station.name == this.listStation[i].name) {
				return i;
			}
		}
		return -1;
	}

	loadListStation() {
		this.collectionModeService.getListStation().subscribe(
			res => {
				this.listStation = res;
			},
			err => {
				this.showError(err.message);
			}
		);
	}

    viewDirection(station: any) {
        this.navCtrl.push(DirectionStopPage, {
            station: station,
            long: station.lng,
            lat: station.lat
        });
    }

	chooseNextStation(station: any) {
		let params = {
			nextStation: station
		}
		this.navCtrl.pop(params);
	}

}
