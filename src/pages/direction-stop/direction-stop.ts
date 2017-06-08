import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, LatLng, CameraPosition, MarkerOptions, Marker, Polyline, PolylineOptions } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { AppConfig } from '../../app/app.config';

import { GoogleMapsLoader } from '../../app/helper/googleMaps.loader';
import * as decodePolyline from 'decode-google-map-polyline';

@IonicPage()
@Component({
	selector: 'page-direction-stop',
	templateUrl: 'direction-stop.html',
})
export class DirectionStopPage {


	directionsService: any;
	map: GoogleMap;
	destinationLocation: LatLng = null;
	poly: any;
	markers: Array<any> = [];
	fullPath: Array<any> = [];
	markerImage: any = {};
	markerImageStart: any = {};

	constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private googleMaps: GoogleMaps, private geolocation: Geolocation) {
		if (this.navParams.data && this.navParams.data.long && this.navParams.data.lat) {
			this.destinationLocation = new LatLng(this.navParams.data.lat, this.navParams.data.long);
		}
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad DirectionStopPage');
		GoogleMapsLoader.load((google) => {
			this.directionsService = new google.maps.DirectionsService;
			this.loadMap();
		});
	}

	dismissView(event) {
		this.navCtrl.pop();
	}

	loadMap() {
		console.log('Loading map!');
		let element: HTMLElement = document.getElementById('map');

		this.map = this.googleMaps.create(element);

		this.map.one(GoogleMapsEvent.MAP_READY).then(
			() => {
				console.log('Map is ready!');
				this.geolocation.getCurrentPosition().then((resp) => {
					let currentLocation: LatLng = new LatLng(resp.coords.latitude, resp.coords.longitude);
					let position: CameraPosition = {
						target: currentLocation,
						zoom: 15,
						tilt: 30
					};

					this.map.moveCamera(position);

					this.addSimpleMarker(currentLocation, 'You are here', (marker: Marker) => {
						marker.showInfoWindow();
					});

					if (this.destinationLocation) {
						this.addSimpleMarker(this.destinationLocation, 'Destination', (marker: Marker) => {
							marker.showInfoWindow();
							this.showDirection(currentLocation, this.destinationLocation);
						});
					}

				}).catch((error) => {
					console.log('Error getting location', error);
				});

				let watch = this.geolocation.watchPosition();
				watch.subscribe((data) => {
					alert(data.coords.latitude + ' - ' + data.coords.longitude);
				});
			}
		);
	}

	addSimpleMarker(point: LatLng, title?: string, callback?: (marker: Marker) => void) {
		var markerParams: MarkerOptions = {
			position: point,
			title: title
		};

		this.map.addMarker(markerParams)
			.then((marker: Marker) => {
				if (callback) {
					callback(marker);
				}
			});
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

	addPolyline(points: Array<LatLng>) {
		let polylineOptions: PolylineOptions = {
			points: points,
			color: '#4285F4',
			width: 5,
			geodesic: true
		};
		this.map.addPolyline(polylineOptions)
			.then((polyLine: Polyline) => {

			});
	}

	getDirection(origin: LatLng, destination: LatLng, callback?: (points: any) => void) {
		this.directionsService.route({
			origin: origin,
			destination: destination,
			travelMode: 'DRIVING'
		}, (response, status) => {
			if (status === 'OK') {
				console.log(response);
				if (response && response.routes && response.routes.length > 0 && response.routes[0].overview_polyline) {
					let polyLineEncode = response.routes[0].overview_polyline;
					let points = decodePolyline(polyLineEncode);
					console.log(points);
					if (callback) {
						callback(points);
					}
				}
			} else {
				alert('Directions request failed due to ' + status);
			}
		});
	}

	showDirection(origin: LatLng, destination: LatLng) {
		this.getDirection(origin, destination, (points => {
			points.push(destination);
			this.addPolyline(points);
		}));
	}

}
