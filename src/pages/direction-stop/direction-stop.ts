import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, LatLng, CameraPosition, MarkerOptions, Marker, Polyline, PolylineOptions } from '@ionic-native/google-maps';
import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';
import { BaseComponent } from '../../app/base.component';

import { GoogleMapsLoader } from '../../app/helper/googleMaps.loader';
import * as decodePolyline from 'decode-google-map-polyline';

@IonicPage()
@Component({
	selector: 'page-direction-stop',
	templateUrl: 'direction-stop.html',
})
export class DirectionStopPage extends BaseComponent {
	directionsService: any;
	map: GoogleMap;
	destinationLocation: LatLng = null;
	polyLines: Array<any> = [];

	markers: Array<any> = [];

	constructor(private injector: Injector, public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private googleMaps: GoogleMaps, private geolocation: Geolocation) {
		super(injector);
		this.hasGoogleMapNative = true;
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

	ngOnDestroy() {
		this.destinationLocation = null;
		this.polyLines.forEach((polyLine: Polyline) => {
			polyLine.remove();
		});
		this.polyLines = [];

		this.markers.forEach((marker: Marker) => {
			marker.remove();
		});
		this.markers = [];
	}

	dismissView(event) {
		this.navCtrl.pop();
	}

	disableMapClickable() {
		this.map.setClickable(false);
	}

	enableMapClickable() {
		this.map.setClickable(true);
	}

	loadMap() {
		console.log('Loading map!');
		let element: HTMLElement = document.getElementById('map');

		this.map = this.googleMaps.create(element);

		let geolocationOptions: GeolocationOptions = {
			enableHighAccuracy: true,
			timeout: 5000
		};
		this.map.one(GoogleMapsEvent.MAP_READY).then(
			() => {
				console.log('Map is ready!');
				this.geolocation.getCurrentPosition(geolocationOptions).then((resp) => {
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
					this.showConfirm('Unable to determine your location. Please make sure location services are enabled. If they are enabled, try to restart them.', 'Error',
						() => {
							this.diagnostic.switchToLocationSettings();
						});
				});

				let watch = this.geolocation.watchPosition();
				watch.subscribe((data) => {
					// alert(data.coords.latitude + ' - ' + data.coords.longitude);
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
				this.markers.push(marker);
				if (callback) {
					callback(marker);
				}
			});
	}

	leaveCurentStop() {
		this.showConfirm('Do you want to leave this stop?', 'Confirm leaving',
			() => {
				this.navCtrl.pop();
			});
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
				this.polyLines.push(polyLine);
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
