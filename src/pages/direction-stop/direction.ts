import { Component, Injector } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, LatLng, CameraPosition, MarkerOptions, Marker, Polyline, PolylineOptions } from '@ionic-native/google-maps';
import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';
import { BaseComponent } from '../../app/base.component';
import { AppConstant } from '../../app/app.constant';

import { GoogleMapsLoader } from '../../app/helper/googleMaps.loader';
import * as decodePolyline from 'decode-google-map-polyline';

import { StayTimeCountDownPage } from '../stay-time-count-down';

@Component({

})
export class DirectionPage extends BaseComponent {

	directionsService: any;
	map: GoogleMap;
	destinationLocation: LatLng = null;
	polyLines: Array<any> = [];

	markers: Array<any> = [];
	currentLocationMarker: Marker;
	watchPositionSubscription: any;
	watchPositionObserverble: any;

	constructor(public injector: Injector, public navCtrl: NavController, public navParams: NavParams, public googleMaps: GoogleMaps, public geolocation: Geolocation) {
		super(injector);
		this.hasGoogleMapNative = true;
		if (this.navParams.data.long && this.navParams.data.lat) {
			this.destinationLocation = new LatLng(Number(this.navParams.data.lat), Number(this.navParams.data.long));
		}
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad DirectionStopPage');
		GoogleMapsLoader.load((google) => {
			this.directionsService = new google.maps.DirectionsService;
			this.loadMap();
		});
	}

	ionViewWillEnter() {
		this.subcribeWatchPosition();
	}

	ionViewWillLeave() {
		this.unsubcribeWatchPosition();
	}

	ngOnDestroy() {
		this.destinationLocation = null;
		this.removeAllMarkersAndPolyline();
	}

	afterLoadMapAndCurrentLocation(currentLocation: LatLng) {

	}

	updateCurrentLocationMarker(currentLocation: LatLng) {
		if (this.currentLocationMarker) {
			this.currentLocationMarker.remove();
		}
		this.addCurrentLocationMarker(currentLocation, '', (marker: Marker) => {
			this.currentLocationMarker = marker;
		});
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
			// enableHighAccuracy: true,
			timeout: AppConstant.GET_LOCATION_TIMEOUT
		};
		let watchOption = geolocationOptions;
		let watchTimeout = AppConstant.WATCH_POSITION_INTERVAL;
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
					this.afterLoadMapAndCurrentLocation(currentLocation);

				}).catch((error) => {
					console.log('Error getting location', error);
					this.showConfirm(this.translate.instant('CONFIRM_LOCATION_SERVICE_PROBLEM'), this.translate.instant('CONFIRMAION_LOCATION'),
						() => {
							this.diagnostic.switchToLocationSettings();
						});
				});

				this.initWatchPosition(watchTimeout, watchOption);
			}
		);
	}

	initWatchPosition(watchTimeout: number, watchOption: GeolocationOptions) {
		watchOption.timeout = watchTimeout;
		this.watchPositionObserverble = this.geolocation.watchPosition(watchOption);
		setTimeout(() => {
			this.subcribeWatchPosition();
		}, watchTimeout)
	}

	subcribeWatchPosition() {
		if (!this.watchPositionObserverble) {
			return;
		}
		this.watchPositionSubscription = this.watchPositionObserverble.subscribe((resp) => {
			if (!resp.coords) {
				return;
			}
			let currentLocation: LatLng = new LatLng(resp.coords.latitude, resp.coords.longitude);
			this.updateCurrentLocationMarker(currentLocation);
		});
	}

	unsubcribeWatchPosition() {
		if (this.watchPositionSubscription) {
			this.watchPositionSubscription.unsubscribe();
			this.watchPositionSubscription = null;
		}
	}

	drawDirectionFromCurrentLocationToDestination(currentLocation: LatLng, destinationName: string) {
		this.removeAllMarkersAndPolyline();
		this.addStartPointMarker(currentLocation, 'You are here', (marker: Marker) => {

		});

		if (this.destinationLocation) {
			this.addEndPointMarker(this.destinationLocation, destinationName, (marker: Marker) => {
				marker.showInfoWindow();
				this.showDirection(currentLocation, this.destinationLocation);
			});
		}
	}

	removeAllMarkersAndPolyline() {
		this.polyLines.forEach((polyLine: Polyline) => {
			polyLine.remove();
		});
		this.polyLines = [];

		this.markers.forEach((marker: Marker) => {
			marker.remove();
		});
		this.markers = [];
	}

	addMarker(markerParams: MarkerOptions, callback?: (marker: Marker) => void) {
		this.map.addMarker(markerParams)
			.then((marker: Marker) => {
				this.markers.push(marker);
				if (callback) {
					callback(marker);
				}
			});
	}

	createMarkerOptions(point: LatLng, title?: string, iconUrl?: string): MarkerOptions {
		var markerParams: MarkerOptions = {
			position: point,
			title: title
		};

		if (iconUrl) {
			markerParams.icon = {
				url: iconUrl
			}
		}

		return markerParams;
	}

	addSimpleMarker(point: LatLng, title?: string, callback?: (marker: Marker) => void) {
		var markerParams = this.createMarkerOptions(point, title);
		this.addMarker(markerParams, callback);
	}

	addStartPointMarker(point: LatLng, title?: string, callback?: (marker: Marker) => void) {
		var markerParams = this.createMarkerOptions(point, title, AppConstant.MARKER_IMAGE.START);
		this.addMarker(markerParams, callback);
	}

	addEndPointMarker(point: LatLng, title?: string, callback?: (marker: Marker) => void) {
		var markerParams = this.createMarkerOptions(point, title, AppConstant.MARKER_IMAGE.END);
		this.addMarker(markerParams, callback);
	}

	addTruckMarker(point: LatLng, title?: string, callback?: (marker: Marker) => void) {
		var markerParams = this.createMarkerOptions(point, title, AppConstant.MARKER_IMAGE.TRUCK);
		this.addMarker(markerParams, callback);
	}

	addCurrentLocationMarker(point: LatLng, title?: string, callback?: (marker: Marker) => void) {
		var markerParams = this.createMarkerOptions(point, title, AppConstant.MARKER_IMAGE.CURRENT_LOCATION);
		this.addMarker(markerParams, callback);
	}

	leaveCurentStop() {
		this.showConfirm(this.translate.instant('CONFIRM_LEAVE_STOP'), this.translate.instant('CONFIRMAION_LEAVE'),
			() => {
				this.navCtrl.pop();
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
				this.showError('Directions request failed due to ' + status);
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
