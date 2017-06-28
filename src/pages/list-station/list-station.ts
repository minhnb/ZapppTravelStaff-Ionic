import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BaseComponent } from '../../app/base.component';
import { DirectionStopPage } from '../direction-stop';

@IonicPage()
@Component({
	selector: 'page-list-station',
	templateUrl: 'list-station.html',
})
export class ListStationPage extends BaseComponent {

    listStation: Array<any> = [];

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams) {
		super(injector);
        this.listStation = [
            {
                name: "Crescent Mall"
            },
            {
                name: "Lotte Mart"
            },
            {
                name: "Vincom Mall"
            },
            {
                name: "Nowzone Mall"
            },
            {
                name: "TSN Airport"
            }
        ]
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ListStationPage');
	}

    viewDirection(station: any) {
        this.navCtrl.push(DirectionStopPage, {
            name: station.name,
            long: 106.702013,
            lat: 10.740790
        });
    }

}
