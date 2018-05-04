'use strict';

const EventEmitter = require('events');

var instance = null;

class EventsController extends EventEmitter {

	constructor() {
		super();
		this.value = 1;
		console.log('CALLING CONSTRUCTOR!!!');
	}

	static getInstance() {
		if(!instance) {
			console.log('before getting instance!!');
			instance = new EventsController();
		}

		return instance;
	}

	emitObservation(idDrone) {
		console.log('>> emitObservation -->');
		this.emit('map:observed', idDrone);
	}

	captureObservation(callback) {
		console.log('>> captureObservation -->');
		this.on('map:observed', function(idDrone){
			callback(idDrone);
		});
		
	}

	emitUnobservation(idDrone) {
		console.log('>> emitUnobservation -->');
		this.emit('map:unobserved', idDrone);
	}

	captureUnobservation(callback) {
		console.log('>> captureUnobservation -->');
		this.on('map:unobserved', function(idDrone){
			callback(idDrone);
		});
		
	}


	emitGoto(latLng) {
		console.log('>> emitGoto - lat:', latLng.lat(), ', lon:', latLng.lng());

		this.emit('map:goto', latLng.lat(), latLng.lng());

	}

	captureGoto(callback) {
		console.log('>> captureGoto -->');

		this.on('map:goto', function(lat, lng){
			callback(lat, lng);
		});

	}



} 

module.exports.getInstance = EventsController.getInstance;
