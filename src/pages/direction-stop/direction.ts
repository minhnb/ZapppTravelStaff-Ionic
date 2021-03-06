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
	hasGoogleMapNative: boolean = true;
	destinationLocation: LatLng = null;
	polyLines: Array<any> = [];
	mapId: string = 'map';
	travelMode: string = AppConstant.GOOGLE_TRAVEL_MODE.DRIVING;

	markers: Array<any> = [];
	currentLocationMarker: Marker;
	watchPositionSubscription: any;
	watchPositionObserverble: any;
	isLoadedMap: boolean = false;
	currentLocation: LatLng = null;
	autoMoveCamera: boolean = true;
	currentDirectionDistance: any;
	currentDirectionDuration: any;

	constructor(public injector: Injector, public navCtrl: NavController, public navParams: NavParams, public googleMaps: GoogleMaps, public geolocation: Geolocation) {
		super(injector);
		if (this.navParams.data.long && this.navParams.data.lat) {
			this.destinationLocation = new LatLng(Number(this.navParams.data.lat), Number(this.navParams.data.long));
		}
	}

	ionViewDidLoad() {
		this.log('ionViewDidLoad DirectionStopPage');
		if (this.isLoadedMap) {
			return;
		}
		this.isLoadedMap = true;
		GoogleMapsLoader.load((google) => {
			this.directionsService = new google.maps.DirectionsService;
			this.loadMap();
		});
	}

	ionViewWillEnter() {
		this.dataShare.hasGoogleMapNative = this.hasGoogleMapNative;
		this.subcribeWatchPosition();
	}

	ionViewWillLeave() {
		this.unsubcribeWatchPosition();
	}

	ionViewWillUnload() {
		super.ionViewWillUnload();
		this.destinationLocation = null;
		this.removeAllMarkersAndPolyline();
		this.dataShare.hasGoogleMapNative = false;
		this.dataShare.googleMapNative = null;
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
		this.log('Loading map!');
		let element: HTMLElement = document.getElementById(this.mapId);

		this.map = this.googleMaps.create(element);

		this.map.one(GoogleMapsEvent.MAP_READY).then(
			() => {
				this.log('Map is ready!');
				this.dataShare.googleMapNative = this.map;
				this.enableMapClickable();
				this.afterLoadMap();
			}
		);
	}

	afterLoadMap() {
		let geolocationOptions: GeolocationOptions = this.initGeolocationOption();
		let watchOption = geolocationOptions;
		let watchTimeout = AppConstant.WATCH_POSITION_INTERVAL;
		this.geolocation.getCurrentPosition(geolocationOptions).then((resp) => {
			let currentLocation: LatLng = new LatLng(resp.coords.latitude, resp.coords.longitude);
			if (this.autoMoveCamera) {
				this.moveCamera(currentLocation);
			}
			this.afterLoadMapAndCurrentLocation(currentLocation);
			if (!this.watchPositionObserverble) {
				this.initWatchPosition(watchTimeout, watchOption);
			}
		}).catch((error) => {
			this.log('Error getting location');
			this.log(error.message);
			this.showLocationServiceProblemConfirmation();
		});
	}

	moveCamera(location: LatLng) {
		let position: CameraPosition = {
			target: location,
			zoom: 15,
			tilt: 30
		};
		this.map.moveCamera(position);
	}

	initWatchPosition(watchTimeout: number, watchOption: GeolocationOptions) {
		watchOption.timeout = watchTimeout;
		this.watchPositionObserverble = this.geolocation.watchPosition(watchOption);
		setTimeout(() => {
			this.subcribeWatchPosition();
		}, watchTimeout)
	}

	subcribeWatchPosition() {
		if (!this.watchPositionObserverble || this.watchPositionSubscription) {
			return;
		}
		this.watchPositionSubscription = this.watchPositionObserverble.subscribe((resp) => {
			if (!resp.coords || !this.isNeedReceiveWatchPositionResult()) {
				return;
			}
			let currentLocation: LatLng = new LatLng(resp.coords.latitude, resp.coords.longitude);
			this.currentLocation = currentLocation;
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
			this.updateCurrentLocationMarker(currentLocation);
		});

		if (this.destinationLocation) {
			this.addEndPointMarker(this.destinationLocation, destinationName, (marker: Marker) => {
				marker.showInfoWindow();
				this.showDirection(currentLocation, this.destinationLocation);
			});
		}
	}

	removeAllMarkersAndPolyline() {
		if (this.map) {
			this.map.clear();
		}
	}

	addMarker(markerParams: MarkerOptions, callback?: (marker: Marker) => void) {
		this.map.addMarker(markerParams)
			.then((marker: Marker) => {
				// this.markers.push(marker);
				if (callback) {
					callback(marker);
				}
			});
	}

	createMarkerOptions(point: LatLng, title?: string, iconUrl?: string, size?: any): MarkerOptions {
		var markerParams: MarkerOptions = {
			position: point,
			title: title
		};

		if (iconUrl) {
			let icon: any = {
				url: iconUrl
			};
			if (size) {
				icon.size = size;
			}
			markerParams.icon = icon;
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
				// this.polyLines.push(polyLine);
			});
	}

	getGoogleDirection(origin: LatLng, destination: LatLng, callback: (response: any, status: any) => void) {
		this.directionsService.route({
			origin: origin,
			destination: destination,
			travelMode: this.travelMode
		}, (response, status) => {
			this.log(response);
			callback(response, status);
		});
	}

	getDirection(origin: LatLng, destination: LatLng, callback?: (points: any) => void) {
		this.currentDirectionDistance = null;
		this.currentDirectionDuration = null;
		this.getGoogleDirection(origin, destination, (response, status) => {
			if (status === AppConstant.GOOGLE_DIRECTION_STATUS.OK) {
				let routes = response.routes;
				if (response && routes && routes.length > 0 && routes[0].overview_polyline) {
					let route = routes[0];
					let polyLineEncode = route.overview_polyline;
					let points = decodePolyline(polyLineEncode);

					let legs = route.legs;
					if (legs && legs.length > 0) {
						this.currentDirectionDistance = legs[0].distance;
						this.currentDirectionDuration = legs[0].duration;
					}

					if (callback) {
						callback(points);
					}
				}
			} else {
				if (status == AppConstant.GOOGLE_DIRECTION_STATUS.ZERO_RESULTS) {
					this.showError(this.translate.instant('ERROR_DIRECTION_NOT_FOUND'));
					return;
				}
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
