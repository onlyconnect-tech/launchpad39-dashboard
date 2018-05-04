'use strict';

const MQTTClient = require('./client');
const configMqtt = require('./config_mqtt');

const DRONE_TYPE  = {
    CAR: 'CAR',
    AIRPLANE: 'AIRPLANE',
    SHIP: 'SHIP',
    ROCKET: 'ROCKET'
};

class AppControllerAdmin {

  constructor(scope) {

    this.listVehicles = [{ 
        id: '/001/001', 
        type: DRONE_TYPE.AIRPLANE}, 
      { id: '/001/002', 
        type: DRONE_TYPE.CAR }];

    this.newDroneId = null;

    this.data = {
      availableOptions: [
        {id: '1', name: DRONE_TYPE.CAR },
        {id: '2', name: DRONE_TYPE.AIRPLANE },
        {id: '3', name: DRONE_TYPE.SHIP },
        {id: '4', name: DRONE_TYPE.ROCKET }
      ],
    selectedOption: {id: '1', name: 'CAR'} //This sets the default value of the select in the ui };
   };


    this.clientId = Math.random().toString(36).substring(7); 
    
    this.endpoint = configMqtt.endpoint;
    
    this.accessKey = configMqtt.accessKey; 
    this.secretKey = configMqtt.secretKey;
    this.regionName = configMqtt.regionName; 

    this.topicNameTelemetries = '/vehicles/demo';

    var client = this.createAdminClient();

    // sperando tutto OK
    
    console.log('DOING CONNECT');
	  client.connect();

	  this.client = client;

	  console.log('2_DOING CONNECT');
    }

    createAdminClient() {

      var self = this;

	    var options = {
	      clientId : this.clientId,
	      endpoint: this.endpoint.toLowerCase(),
	      accessKey: this.accessKey,
	      secretKey: this.secretKey,
	      regionName: this.regionName
	    };

	    console.log('PUBLISHING MAC ADDRESS A VEHICLES');

	    var client =  new MQTTClient(options);


    client.on('connectionLost', function(){
      console.log('Connection lost');

    });

    client.on('messageArrived', function(msg){
      console.log('messageArrived in ' + msg);

	});

    client.on('connected', function(){
      console.log('connected');  

      // self.subscribe(self.client, self.topicNameTelemetries);
      // doing authomatic subscribe
      
      console.log('DOING AUTOMATIC PUBLISHING');
      self.publishListVehicles(client, self.topicNameTelemetries);

    });

    client.on('subscribeFailed', function(e){
      console.log('subscribeFailed ', e);
    });

    client.on('subscribeSucess', function(){
      console.log('subscribeSucess');
     
    });

    client.on('unsubscribeFailed', function(e){
      console.log('unsubscribeFailed ', e);
    });

    client.on('unsubscribeSucess', function(){
      console.log('unsubscribeSucess');
    });

    client.on('publishFailed', function(e){
      console.log('publishFailed', e);
    });

    return client;
	    

	}

  addDrone() {

    console.log('add a drone', this.newDroneId);

    if(this.newDroneId){
      console.log('ADDING:', this.newDroneId);
      this.listVehicles.push({ id: this.newDroneId, type: this.data.selectedOption.name});

      this.newDroneId = null;
    }
  }

  removeDrone(idDrone) {
    console.log('CALL REMOVE_DRONE:', idDrone);

    this.listVehicles = this.listVehicles.filter(function(item) {
      return item.id !== idDrone;
    });
  }

  msgInputKeyUp($event) {
    if ($event.keyCode === 13) {
      this.addDrone();
    }
  }

  subscribe(client, topicNameTelemetries) {
    console.log('****AA ', client);
    console.log('***AA SUBSCRIBING:', topicNameTelemetries);
    
    this.client.subscribe(this.topicNameTelemetries);
  }

  publishListVehicles() {

    var self = this;

  	setInterval(function(){ self.publishMsg(JSON.stringify(self.listVehicles)); }, 3000);
 	
  }

  publishMsg(message) {
  	console.log(this.topicNameTelemetries, message);
  	console.log(this.client);
  	
    this.client.publish(this.topicNameTelemetries, message);
  }
}

AppControllerAdmin.$inject = ['$scope'];

angular.module('voltarobots.ccs.dashboard-admin', []).controller('AppControllerAdmin', AppControllerAdmin);
