import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, LatLng, CameraPosition, MarkerOptions, Marker, Polyline, PolylineOptions } from '@ionic-native/google-maps';

@IonicPage()
@Component({
	selector: 'page-direction-stop',
	templateUrl: 'direction-stop.html',
})
export class DirectionStopPage {

	map: GoogleMap;

	exPathArray: Array<any> = [
		{
			"lat": 41.87838051825938,
			"lng": -87.61723279953003
		},
		{
			"lat": 41.87833258844385,
			"lng": -87.61900305747986
		},
		{
			"lat": 41.87829264690345,
			"lng": -87.62068748474121
		},
		{
			"lat": 41.87830862352262,
			"lng": -87.62217879295349
		},
		{
			"lat": 41.8782527053381,
			"lng": -87.62414216995239
		},
		{
			"lat": 41.879450941439536,
			"lng": -87.62427091598511
		},
		{
			"lat": 41.8807929391998,
			"lng": -87.62419581413269
		},
		{
			"lat": 41.8820310668989,
			"lng": -87.62418508529663
		},
		{
			"lat": 41.883205269067794,
			"lng": -87.62422800064087
		},
		{
			"lat": 41.88428359899069,
			"lng": -87.62436747550964
		},
		{
			"lat": 41.884806782137034,
			"lng": -87.62438893318176
		},
		{
			"lat": 41.88514225609874,
			"lng": -87.62440502643585
		},
		{
			"lat": 41.8857133565293,
			"lng": -87.624431848526
		},
		{
			"lat": 41.886328382053115,
			"lng": -87.62445867061615
		},
		{
			"lat": 41.88681560586246,
			"lng": -87.62446403503418
		},
		{
			"lat": 41.887594357513954,
			"lng": -87.62447476387024
		},
		{
			"lat": 41.88830520970835,
			"lng": -87.62442111968994
		},
		{
			"lat": 41.88831319676671,
			"lng": -87.62510776519775
		},
		{
			"lat": 41.888229332604,
			"lng": -87.6254403591156
		},
		{
			"lat": 41.887945791048104,
			"lng": -87.6257461309433
		}
	];
	poly: any;
	markers: Array<any> = [];
	fullPath: Array<any> = [];
	markerImage: any = {};
	markerImageStart: any = {};

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

				let centerPoint: LatLng = new LatLng(41.87838051825938, -87.61723279953003);

				let position: CameraPosition = {
					target: centerPoint,
					zoom: 15,
					tilt: 30
				};

				this.map.moveCamera(position);

				this.fullPath = this.exPathArray;
				this.demoMarkerAndPolyline();
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

	addMarker(point) {
		var markerParams: MarkerOptions = {
			position: point,
			// title: '#' + this.markers.length,
			icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
		};

		this.map.addMarker(markerParams)
			.then((marker: Marker) => {
				if (this.markers.length > 1) {
					var lastMarker = this.markers[this.markers.length - 1];
					lastMarker.remove();
				}
				this.markers.push(marker);
			});
	}

	demoMarkerAndPolyline() {
		let self = this;
		let fullPath = this.fullPath;
		let path: Array<LatLng> = [];
		for (let i = 0; i < fullPath.length; i++) {
			let point: LatLng = new LatLng(fullPath[i].lat, fullPath[i].lng);
			path.push(point);
			self.addMarker(point);
			self.map.setCenter(point);
		}

		let polylineOptions: PolylineOptions = {
			points: path,
			color: '#4285F4',
			width: 5,
			geodesic: true
		};
		this.map.addPolyline(polylineOptions)
			.then((polyLine: Polyline) => {

			});

	}

}
