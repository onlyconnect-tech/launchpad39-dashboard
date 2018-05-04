/*
Copyright 2016-2016 Amazon.com, Inc. or its affiliates. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

    http://aws.amazon.com/apache2.0/

or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

'use strict';

const URI = require('urijs');

const configMqtt = require('./config_mqtt');

const VehicleWatcher = require('./vehicle_watcher');
const Converter = require('./util/degrees_radiants_utils');
const MissionValidator = require('./util/mission_validator');

/** controller of the app */

/*global angular: true */

// @flow

class AppControllerClient {

  constructor(scope, mqttConfig) {
    this.scope = scope;
    this.mqttConfig = mqttConfig;

    this.vehicleWatcher = new VehicleWatcher(scope, mqttConfig);
    this.lastCommand = null;
    this.missionRequest = null;

    /*

    this.doStartVehicleWatcher('demo-clientid-' 
     + Math.random().toString(36).substring(7), 'demo');
    
    */
  }

  /**
   * start application.
   * 
   */

  doStartVehicleWatcher(clientID: string, customerID: string) {
    this.vehicleWatcher.activateVehicleWatcher(clientID, customerID);
  }

  doStopVehicleWatcher() {
    this.vehicleWatcher.disactivateVehicleWatcher();
  }

  log() {
    return this.vehicleWatcher.logMsg;
  }

  isMapMapView() {
    return this.vehicleWatcher.isMapMapView();
  }

  doSelectMapView() {
    this.vehicleWatcher.doSelectMapView();
  }

  doSelectMultiSelect() {
    this.vehicleWatcher.doSelectMultiSelect();
  }

  armCommand() {

    this.lastCommand = 'ARM';

    this.vehicleWatcher.modelControllerMulti.setCommandArm();
  }

  disarmCommand() {

    this.lastCommand = 'DISARM';

    this.vehicleWatcher.modelControllerMulti.setCommandDisarm();

  }

  takeoffCommand() {

    this.lastCommand = 'TAKEOFF';

    this.vehicleWatcher.modelControllerMulti.setCommandTakeoff();

  }

  landnowCommand() {

    this.lastCommand = 'LANDNOW';

    this.vehicleWatcher.modelControllerMulti.setCommandLandnow();

  }

  goto1Command() {
    console.log('------- GOTO COMMAND -------------');

    this.lastCommand = 'GOTO1';

    this.vehicleWatcher.modelControllerMulti.setCommandGoto1();

  }

  goto2Command() {

    this.lastCommand = 'GOTO2';

    this.vehicleWatcher.modelControllerMulti.setCommandGoto2();

  }

  goto3Command() {

    this.lastCommand = 'GOTO3';

    this.vehicleWatcher.modelControllerMulti.setCommandGoto3();

  }

  goMission() {

    this.lastCommand = 'SEND-MISSION';

    /*

    if (this.missionRequest) {

      var testResult = null;

      try {

        var jsonObj = JSON.parse(this.missionRequest);

        testResult = MissionValidator.validateJsonObj(jsonObj);

        console.log('TEST:', testResult);

      } catch (exc) {

        if (exc instanceof SyntaxError) {
          console.error('CATCHED:', exc);
        } else {
          console.error('OTHER ERROR:', exc);
        }


      }

    }

    */

  }


  /*
  
  doPublish(droneId, message) {
    console.log('DO PUBLISH - ID:', droneId, ', MESSAGE:', message);

    var clientCtr = this.getClientControll(0);
    clientCtr.publish(message);

  }

  */


}

var currentLocation = document.getElementById('ccs-app-controller');

var uri = new URI(currentLocation.src);

const queryObj = uri.search(true);


AppControllerClient.$inject = ['$scope', 'mqttConfig'];

angular.module('voltarobots.ccs.dashboard-client', []).controller('AppControllerClient', AppControllerClient);

angular.module('voltarobots.ccs.dashboard-client').factory('mqttConfig', function () {
  return {
    endpoint: configMqtt.endpoint,
    accessKey: configMqtt.accessKey,
    secretKey: configMqtt.secretKey,
    regionName: configMqtt.regionName
  };
});

angular.module('voltarobots.ccs.dashboard-client').filter('toDegrees', function () {

  return function (radians) {

    return Converter.convertRadians(radians);
  };

});

if (queryObj.id == 'demo') {

  setTimeout(function () {
    console.log('**************** STARTING DEMO ***********************');
    angular.element(document.getElementById('MainWrap')).scope().vm.doStartVehicleWatcher('demo-clientid-' +
      Math.random().toString(36).substring(7), 'demo');
  }, 3000);


}