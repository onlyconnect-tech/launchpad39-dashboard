'use strict';

const MQTTClient = require('./lib/mqtt-lib').MQTTClient;

const ArrUtils = require('./util/arr_utils');
const MsgsUtils = require('./util/msgs_utils');

const EventsController = require('./events_controller');

const ModelControllerMulti = require('./model_controller_multi').ModelControllerMulti;

const COMMAND = require('./model_controller_multi').COMMAND;

const VIEW_TYPE = {
  SINGLE_SELECT: 'SINGLE_SELECT',
  MULTI_SELECT: 'MULTI_SELECT'
};

const LOG_MSG_TYPE = {
  SUCCESS: 'list-group-item-success',
  INFO: 'list-group-item-info',
  WARNING: 'list-group-item-warning',
  DANGER: 'list-group-item-danger'
};

/**
 * @class VehicleWatcher
 * 
 */

class VehicleWatcher {

  constructor(scope, mqttConfig) {

    this.scope = scope;

    this.mqttConfig = mqttConfig;

    this.viewType = VIEW_TYPE.SINGLE_SELECT;

    this.logMsg = null;
    this.stopCommand = false;

    // list of drones
    this.listDrones = [];

    // list of drones observed, only queue name
    this.listDronesObserved = [];

    // list of drones observed, all object 
    this.listDronesObservedObj = [];

    this.modelControllerMulti = new ModelControllerMulti(scope);

    this.clientID = null;
    this.customerID = null;
    this.client = null;

  }

  activateVehicleWatcher(clientID, customerID) {

    this.modelControllerMulti.addClickListerEvents();

    this.clientID = clientID;
    this.customerID = customerID;

    this.stopCommand = false;

    var eventsController = EventsController.getInstance();

    var self = this;

    eventsController.captureObservation(function (idDrone) {
      console.log('TO ADD', idDrone, 'TO', self.listDronesObserved);

      var previousDroneObservedId = null; // if any

      if (self.viewType == VIEW_TYPE.SINGLE_SELECT) {
        previousDroneObservedId = self.listDronesObserved[0];
      }

      // don't repeat the same
      if (self.listDronesObserved.indexOf(idDrone) === -1) {

        // remove prevous
        if (previousDroneObservedId && self.viewType == VIEW_TYPE.SINGLE_SELECT) {

          self.listDronesObserved.pop();
          self.listDronesObservedObj.pop();

          self.modelControllerMulti.setDroneUnobserved(previousDroneObservedId);
        }

        self.listDronesObserved.push(idDrone);

        var drone = self.modelControllerMulti.getDrone(idDrone);
        self.listDronesObservedObj.push(drone);

        self.modelControllerMulti.setDroneObserved(idDrone);
      }
    });

    // EVENTS CAPTURE END OBSERVATION FIRED IN MODEL_CONTROLLER_MULTI.setDroneUnobserved
    eventsController.captureUnobservation(function (idDrone) {

      console.log('TO REMOVE', idDrone, 'TO', self.listDronesObserved);

      var index = self.listDronesObserved.indexOf(idDrone);

      if (index !== -1) {
        self.listDronesObserved.splice(index, 1);
        self.listDronesObservedObj.splice(index, 1);

        self.modelControllerMulti.setDroneUnobserved(idDrone);
      }
    });


    eventsController.captureGoto(function (lat, lng) {

      console.log('CAPTURE GOTO:', self.listDronesObserved[0], lat, lng);

      // TO ATTACH PUBLISH

      var gotoMsg = {
        jsonrpc: '2.0',
        method: 'goto',
        params: {
          lat: lat,
          lon: lng,
          alt: 3.0,
          relative: false
        },
        vehicle_id: 7
      };

      var queueCommands = self.listDronesObserved[0] + '/commands';

      console.log('GOTO1 CALL:', queueCommands, '--->', JSON.stringify(gotoMsg), gotoMsg);

      // var message = JSON.stringify(gotoMsg);

      self.publishMsg(queueCommands, gotoMsg);
    });

    // '/vehicles';
    var topicNameVehicles = '/vehicles' + '/' + customerID;
    var topicRequestNameVehicles = '/request-vehicles' + '/' + customerID;
    
    var client = this.createMqttClient(clientID, this.mqttConfig.endpoint,
      this.mqttConfig.accessKey, this.mqttConfig.secretKey, this.mqttConfig.regionName, topicNameVehicles, topicRequestNameVehicles);

    this.client = client;

    return client;
  }

  disactivateVehicleWatcher() {

    console.log('*** DISACTIVATE VEHICLE WATCHER *****');

    this.stopCommand = true;

    if (this.client) {
      this.client.unsubscribe('/vehicles' + '/' + this.customerID);
    }

    var self = this;

    this.listDrones.forEach(function (idDrone) {
      self.modelControllerMulti.removeDrone(idDrone);
    });

    this.listDrones = [];

    this.listDronesObserved = [];

    this.listDronesObservedObj = [];
  }

  /**
   * [isMapMapView description]
   * @return {Boolean} [description]
   */

  isMapMapView() {
    if (this.viewType == VIEW_TYPE.MULTI_SELECT) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * [doSelectMapView description]
   * @return {void} [description]
   */

  doSelectMapView() {
    console.log('*********************************');
    console.log('*********************************');
    console.log('MAP VIEW!!!');

    if (this.viewType == VIEW_TYPE.MULTI_SELECT) {

      console.log('UNSELECT PREVIOUS');
      //set prevous unobserved
      var previousDroneObservedId = null;

      do {

        previousDroneObservedId = this.listDronesObserved.pop();

        if (previousDroneObservedId) {
          console.log('*** UNSELECTION PREVIOUS:', previousDroneObservedId);

          this.listDronesObservedObj.pop();

          this.modelControllerMulti.setDroneUnobserved(previousDroneObservedId);
        }


      } while (previousDroneObservedId);

    }

    this.viewType = VIEW_TYPE.SINGLE_SELECT;
  }

  /**
   * [doSelectMultiSelect description]
   * @return {void} [description]
   */

  doSelectMultiSelect() {
    console.log('*********************************');
    console.log('*********************************');
    console.log('MULTI SELECT!!!');

    this.viewType = VIEW_TYPE.MULTI_SELECT;
  }

  /**
   * [setCommandGOTO1 description]
   */

  setCommandGOTO1() {
    this.modelControllerMulti.commandStatus = COMMAND.GOTO1;
  }

  /**
   * @access private
   * 
   * [createMqttClient description]
   * @return {void} [description]
   */

  createMqttClient(clientID, endpoint, accessKey, secretKey, regionName, topicNameVehicles, topicRequestNameVehicles) {

    var options = {
      clientId: clientID,
      endpoint: endpoint.toLowerCase(),
      accessKey: accessKey,
      secretKey: secretKey,
      regionName: regionName
    };

    var self = this;

    var client = new MQTTClient(options, this.scope);

    client.on('onConnectionLost', function () {

      if (!self.stopCommand) {

        console.log('Connection lost');

        // 
        self.logMsg = {
          type: LOG_MSG_TYPE.WARNING,
          msg: 'Connection lost, retrying connection....'
        };

        self.eraseVehiclesOnRestart();

        // wait and retry connection

        /*

        setTimeout(function () {

          // new client
          var client = self.createMqttClient.call(self, clientID, endpoint,
            accessKey, secretKey, regionName, topicNameVehicles);

          // update client ref 
          self.client = client;

        }, 1000);

        */

      } else {
        console.log('CLIENT DISCONNECTED!!!');

      }



    });

    client.on('onMessageArrived', function (msg) {

      // console.log('messageArrived in ', msg.destinationName, msg.payloadString );

      if (msg._topic === topicNameVehicles) {

        var publishedDrones = JSON.parse(msg._message.toString());

        console.log('<-- FROM', topicNameVehicles, ':');

        publishedDrones.forEach(function (drone) {
          console.log(drone);
        });

        console.log('####################################');

        self.updateListVehicles(publishedDrones);

      } else {
        // telemetry or command response
        self.doRouteMessage(msg);
      }

    });

    client.on('onConnect', function () {
      console.log('connected>>>');

      self.logMsg = {
        type: LOG_MSG_TYPE.INFO,
        msg: 'Connection activated, waiting vehicles telemetries'
      };

      setTimeout(function () {
        // clean msg
        self.logMsg = null;

        if (self.scope && !self.scope.$$phase) {
          self.scope.$digest();
        }

      }, 5000);

      console.log('DOING SUBSCRIBE!!!');
      self.subscribeQueueVehicles(client, topicNameVehicles);

      self.requestingVehiclesForCustomer(client, topicRequestNameVehicles, clientID);

    });

    client.on('onSubFailure', function (e) {
      console.log('onSubFailure ', e);
    });

    client.on('onSubSuccess', function () {
      console.log('onSubSuccess');

    });

    client.on('unsubscribeFailed', function (e) {
      console.log('unsubscribeFailed ', e);
    });

    client.on('unsubscribeSucess', function () {
      console.log('unsubscribeSucess');

      if (self.stopCommand) {
        console.log('DOING DISCONNECT ON STOP COMMAND!!!');
        self.client.disconnect();
      }


    });

    return client;
  }

  eraseVehiclesOnRestart() {

    this.listDrones.forEach(function (idDrone) {
      this.modelControllerMulti.removeDrone(idDrone);
    }.bind(this));

    this.listDrones = [];
  }

  /**
   * @access private
   * 
   * updateListVehicles description
   * @param  {array} publishedDrones list of queues to subscribe vehicles
   * @return {void}                 
   */

  updateListVehicles(publishedDrones) {

    // normalize ids (queue names)
    publishedDrones = publishedDrones.map(function (elem) {
      elem.id = MsgsUtils.normalizeIdDrone(elem.id);
      return elem;
    });

    var listPublishedDronesNames = publishedDrones.map(function (elem) {
      return elem.id;
    });

    ArrUtils.renderSame(listPublishedDronesNames, this.listDrones,
      this.callbackOnRemoveElem.bind(this),
      this.callbackOnNewElem(publishedDrones).bind(this));
  }

  /**
   * @access private
   * 
   * [callbackOnRemoveElem description]
   * @param  {string} queueName [description]
   * @return {void}           [description]
   */

  callbackOnRemoveElem(queueName) {
    // unsunscribe 

    var queueNameSub = MsgsUtils.buildQueueName(queueName);
    console.log('UNSUBSCRIBING QUEUE:', queueNameSub);

    this.client.unsubscribe(queueNameSub);

    this.modelControllerMulti.removeDrone(queueName);
  }

  /**
   * @access private
   * 
   * [callbackOnNewElemNew description]
   * @param  {array} arrDescriptorDrones [description]
   * @return {function}                     [description]
   */

  callbackOnNewElem(arrDescriptorDrones) {

    // subscribe
    return function (queueName) {

      var objDrone = null;

      arrDescriptorDrones.forEach(
        function (elem) {
          if (elem.id == queueName) {
            objDrone = elem;
          }
        });

      var queueNameSub = MsgsUtils.buildQueueName(queueName);
      console.log('SUBSCRIBING QUEUE:', queueNameSub, objDrone);

      this.client.subscribe(queueNameSub, {
        qos: 0
      });

      var historyCommand = {jsonrpc: '2.0', method: 'history', id: this.clientID };

      console.log("ASKING HISTORY on queue:", queueName + '/commands', ", message: ", historyCommand);

      try {
        this.client.publish(queueName + '/commands', historyCommand);
      } catch(e) {
        console.log('ERROR publiching on topic:', queueName + '/commands', '- command:', historyCommand, 
        '- ERROR:', e);
      }
      

      this.modelControllerMulti.addDrone(queueName, objDrone);
    };
  }

  /**
   * @access private
   * 
   * [subscribeQueueVehicles description]
   * @return {void} [description]
   */

  subscribeQueueVehicles(client, topicNameVehicles) {
    console.log('* SUBSCRIBING:', topicNameVehicles);

    client.subscribe(topicNameVehicles, {
      qos: 0
    });
  }

  /**
   * @access private
   * 
   */
  
  requestingVehiclesForCustomer(client, topicRequestNameVehicles, clientID) {
    
    var requestVehiclesCustomerID = {jsonrpc: '2.0', method: 'request-vehicles', id: clientID };

    console.log('* requestingVehiclesForCustomer:', topicRequestNameVehicles, ', message:', requestVehiclesCustomerID, ', key:', clientID);

    try {
      client.publish(topicRequestNameVehicles, requestVehiclesCustomerID);
    } catch(e) {
      console.log('ERROR publiching on topic:', topicRequestNameVehicles, '- command:', requestVehiclesCustomerID, 
      '- ERROR:', e);
    }
  }
  

  /**
   * [publishMsg description]
   * @param  {string} topic   [description]
   * @param  {string} message [description]
   * @return {void}         [description]
   * @private
   */

  publishMsg(topic, message) {

    this.client.publish(topic, message);
  }

  /**
   * @access private
   * 
   * Process incoming messages.
   * @param  {Paho.MQTT.Message} msg - message received on subscribed topics
   * @return {void} 
   */

  doRouteMessage(msg) {
    // getDestination and payload

    // --> telemetry send event to MapController 

    // console.log('received msg:', msg); 
    // msg.destinationName, msg.payloadString
    // specific queue for each vehicles

    // update vehicle position if telemetry 

    // log command if response to a command 
    // queueName + object telemetry --> model controller

    // check message type by destination
    if (MsgsUtils.checkIfTelemetry(msg._topic)) {

      // get queue name
      let queueName = MsgsUtils.getQueueNamePart(msg._topic);

      console.log('<<-- RECEIVED TELEMETRY:', queueName, msg._message.toString());

      let objPayload = MsgsUtils.doParsingIoTPayloadTelemetry(msg._message.toString());

      if (objPayload && objPayload.location) {
        // lat, lon, alt, roll, pitch, yaw

        this.modelControllerMulti.getNotificationTelemetry(queueName, objPayload);

      } else {
        // stange situation: invalid format

      }
    } else if (MsgsUtils.checkIfCommands(msg._topic)) {

      let queueName = MsgsUtils.getQueueNamePart(msg._topic);
      console.log('<<-- RECEIVED COMMAND:', queueName, msg._message.toString());

      let objPayload = JSON.parse(msg._message.toString());

      if (objPayload.method === 'history-response') {
        // send history
        this.modelControllerMulti.getNotificationHistoryTelemetry(queueName, objPayload);

      }
    }


  }
}

module.exports = VehicleWatcher;