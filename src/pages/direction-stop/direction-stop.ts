import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, LatLng, CameraPosition, MarkerOptions, Marker } from '@ionic-native/google-maps';

@IonicPage()
@Component({
	selector: 'page-direction-stop',
	templateUrl: 'direction-stop.html',
})
export class DirectionStopPage {

	map: GoogleMap;

	constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private googleMaps: GoogleMaps) {
		console.log(this.alertCtrl);
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad DirectionStopPage');
		this.loadMap();
	}

	dismissView(event) {
		this.navCtrl.pop();
	}

	loadMap() {
		// make sure to create following structure in your view.html file
		// and add a height (for example 100%) to it, else the map won't be visible
		// <ion-content>
		//  <div #map id="map" style="height:100%;"></div>
		// </ion-content>

		// create a new map by passing HTMLElement
		console.log('Loading map!');
		let element: HTMLElement = document.getElementById('map');

		this.map = this.googleMaps.create(element);

		// listen to MAP_READY event
		// You must wait for this event to fire before adding something to the map or modifying it in anyway
		this.map.one(GoogleMapsEvent.MAP_READY).then(
			() => {
				console.log('Map is ready!');
				// Now you can add elements to the map like the marker

				// create LatLng object
				let ionic: LatLng = new LatLng(43.0741904, -89.3809802);

				// create CameraPosition
				let position: CameraPosition = {
					target: ionic,
					zoom: 18,
					tilt: 30
				};

				// move the map's camera to position
				this.map.moveCamera(position);

				// create new marker
				let markerOptions: MarkerOptions = {
					position: ionic,
					title: 'Ionic'
				};

				const marker: any = this.map.addMarker(markerOptions)
					.then((marker: Marker) => {
						marker.showInfoWindow();
					});
			}
		);
	}

	leaveCurentStop() {
		let alert = this.alertCtrl.create({
			title: 'Confirm leaving',
			message: 'Do you want to leave this stop?',
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel',
					handler: () => {
						console.log('Cancel clicked');
						this.map.setClickable(true);
					}
				},
				{
					text: 'OK',
					handler: () => {
						console.log('OK clicked');
						this.map.setClickable(true);
						this.navCtrl.pop();
					}
				}
			]
		});
		this.map.setClickable(false);
		alert.present();
	}
}
