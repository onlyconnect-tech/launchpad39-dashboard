'use strict';

const Converter = require('./util/degrees_radiants_utils');
const EventsController = require('./events_controller');

/*global google: true */
/*global map: true */

/** @module  model_controller_multi */

/**
 * Enum for drone type values.
 * @readonly
 * @enum {string} model_controller_multi#DRONE_TYPE
 */
const DRONE_TYPE  = {
    CAR: 'CAR',
    AIRPLANE: 'AIRPLANE',
    SHIP: 'SHIP',
    ROCKET: 'ROCKET'
};

const COMMAND = {
  NONE: 'NONE',
  ARM: 'ARM',
  DISARM: 'DISARM',
  TAKEOFF: 'TAKEOFF',
  LANDNOW: 'LANDNOW',
  GOTO1: 'GOTO1',
  GOTO2: 'GOTO2',
  GOTO3: 'GOTO3'
};

function markerClicked(e) {
    // this is MapControllerVehicle
    
    console.log('Marker ' + this.idDrone + ' has been clicked');

    var eventsController = EventsController.getInstance();

    eventsController.emitObservation(this.idDrone);
}

/**
 * @class ModelControllerMulti
 * 
 */

class ModelControllerMulti {

		constructor(scope) {

      this.scope = scope;

      this.listDrones = [];
			// map drone info
      
      /** @member {Map<string, Object>} - information of drones */ 

			this.mapDronesInfo = new Map();

      // for angular sincronized with this.mapDronesInfo 
      this.arrDronesInfo = [];

      this.commandStatus = COMMAND.NONE;

 		}


    addClickListerEvents() {
      
      var self = this;

      var myVar = setInterval(function () {

        // wait for map object creation
        if(typeof map !== 'undefined') {
          console.log('******************* ADDING EVENT CLICK LISTENER');
          
          map.addListener('click', function(e) {
              console.log('>>>:', e.latLng.lat(), e.latLng.lng());
              self.captureLatLongOnMapClick(e.latLng);
          });

          clearInterval(myVar);

        } 

      }, 100);
			


    }

    /**
     * [setDroneObserved description]
     * @param {string} idDrone [description]
     */
    
    setDroneObserved(idDrone) {

      console.log('****************************************');
      console.log('******* CALLING setDroneObserved:', idDrone);
      console.log('****************************************');
      
      var droneStatus = this.mapDronesInfo.get(idDrone);

      if(droneStatus) {
        droneStatus.isObserved = true;
        droneStatus.mapControllerVehicle.setIsObserved(true);

        // make angular to repaint the ui, remove these if you don't use angular
        if(this.scope && !this.scope.$$phase) {
          this.scope.$digest();
        }
      }

    }

    /**
     * [setDroneUnobserved description]
     * @param {string} idDrone [description]
     */
    setDroneUnobserved(idDrone) {

      console.log('****************************************');
      console.log('******* CALLING setDroneUnobserved:', idDrone);
      console.log('****************************************');

      var droneStatus = this.mapDronesInfo.get(idDrone);

      if(droneStatus) {
        droneStatus.isObserved = false;
        droneStatus.mapControllerVehicle.setIsObserved(false);

        // make angular to repaint the ui, remove these if you don't use angular
        if(this.scope && !this.scope.$$phase) {
          this.scope.$digest();
        }

      }
    }

    /**
     * [callDroneUnobserved description]
     * @param {string} idDrone [description]
     */
    callDroneUnobserved(idDrone) {

      console.log('****************************************');
      console.log('******* CALLING callDroneUnobserved:', idDrone);
      console.log('****************************************');

      if(this.commandStatus == COMMAND.GOTO1){
          map.setOptions({ draggableCursor: null }); 
          this.commandStatus = COMMAND.NONE;
      }

      // SENDING EVENTS TO VEHICLE_WATCHER
      var eventsController = EventsController.getInstance();

      eventsController.emitUnobservation(idDrone);
    }

    /**
     * [isDroneObserved description]
     * @param  {string}  idDrone [description]
     * @return {Boolean}         [description]
     */
    
    isDroneObserved(idDrone) {

      var droneStatus = this.mapDronesInfo.get(idDrone);

      if(droneStatus) {
          return droneStatus.isObserved;
      }

      return false;
    }

    /**
     * [addDrone description]
     * @param {string} idDrone - Queue name
     * @param {droneProperties} droneProperties - type of drone
     */
    
    addDrone(idDrone, droneProperties) {

        console.log('AGGING DRONE:', idDrone, '- DRONE PROPERTIES:', droneProperties);

        this.listDrones.push(idDrone);

        var mapControllerVehicle = 
          new MapControllerVehicle(idDrone, droneProperties.type);

        var droneInfo = {
          // DISCONNECTED, CONNECTED, SUBSCRIBE, UNSUBSCRIBE
          status: null,
          droneId: idDrone,
          type: droneProperties.type,
          lat: null,
          lon: null,
          alt: null,
          roll: null,
          pitch: null,
          yaw: null,
          groundspeed: null
        };

        var droneStatus = { id: idDrone, isObserved: false, hasReceived: false, status: droneInfo, 
          mapControllerVehicle: mapControllerVehicle };

        // add to the map
        this.mapDronesInfo.set(idDrone, droneStatus);
    }

    /**
     * [getListDrones description]
     * @return {object} [description]
     */
    
    getListDrones(){
      console.log('---------------------- CALLED LIST DRONES -------------------');

      angular.merge(this.arrDronesInfo, Array.from(this.mapDronesInfo));
      return this.arrDronesInfo;      
    }

    /**
     * [getDrone description]
     * @param  {string} idDrone [description]
     * @return {object}         [description]
     */
    getDrone(idDrone) {

      console.log('CALLING GET_DRONE:', idDrone);

      return this.mapDronesInfo.get(idDrone);

    }

    /**
     * [getDroneInfo description]
     * @param  {string} idDrone [description]
     * @return {object}         [description]
     */
    
    getDroneInfo(idDrone) {

      console.log('CALLING GET_DRONE_INFO:', idDrone);

      var droneStatus = this.mapDronesInfo.get(idDrone);

      if(droneStatus) {
          return droneStatus.status;
      }

      return null;
    }

    /**
     * [getDroneMapControllerVehicle description]
     * @param  {string} idDrone [description]
     * @return {object}         [description]
     */
    
    getDroneMapControllerVehicle(idDrone) {

      console.log('CALLING GET_DRONE_INFO:', idDrone);

      var droneStatus = this.mapDronesInfo.get(idDrone);

      if(droneStatus) {
          return droneStatus.mapControllerVehicle;
      }

      return null;
    }

   /**
    * [removeDrone description]
    * @param  {string} idDrone -  queue name
    * @return {void}         
    */
   
   removeDrone(idDrone) {
			var index = this.listDrones.indexOf(idDrone);
			if( index !== -1) {
		          // elemento da togliere
		          this.listDrones.splice(index, 1);
		    }

		    // remove from the map
        console.log('MAP_DRONES_INFO:',  this.mapDronesInfo.keys());

        var droneStatus = this.mapDronesInfo.get(idDrone);

        var mapControllerVehicle = droneStatus.mapControllerVehicle;

        if(droneStatus.isObserved) {

         // for goto commanf
         if(this.commandStatus == COMMAND.GOTO1) {

           map.setOptions({ draggableCursor: null });

           this.commandStatus = COMMAND.NONE;
         }

         this.callDroneUnobserved(idDrone);
        } 
        
        mapControllerVehicle.setDeleteVehicleOnMap();

		    var isDeleted = this.mapDronesInfo.delete(idDrone);

        console.log('DRONE_ID:', idDrone , '- DELETED:', isDeleted);

        return;
		}
    
    /**
     * [getNotificationTelemetry description]
     * @param  {string} queueName    [description]
     * @param  {object} objTelemetry [description]
     * @return {void}              [
     */
    
    getNotificationTelemetry(queueName, objTelemetry) {
        console.log('>> getNotificationTelemetry:', queueName, objTelemetry);

        var isFirstTelemetryValue = true;

        this.mapDronesInfo.forEach( function(droneStatus) {
          if(droneStatus.hasReceived){
            // someone has yet received
            isFirstTelemetryValue = false;
          }
        });

        // var droneStatus = { id: idDrone, status: droneInfo, mapControllerVehicle: mapControllerVehicle };
        var droneStatus = this.mapDronesInfo.get(queueName);

        if(!droneStatus) {
          console.log('DRONE ERASED:', queueName);
          return;
        }

        if(!droneStatus.hasReceived){
          droneStatus.hasReceived = true;
        }

        // cambiare status: droneInfo
        
        var droneInfo = droneStatus.status;

        droneInfo.lat = objTelemetry.location.global.lat;
        droneInfo.lon = objTelemetry.location.global.lon;
        droneInfo.alt = objTelemetry.location.global.alt;

        droneInfo.groundspeed = objTelemetry.groundspeed;

    // 'attitude': {'yaw': 2.2328476905822754, 'roll': 0.0015431742649525404, 'pitch': 0.0016542377416044474}

        droneInfo.yaw = objTelemetry.attitude.yaw;
        droneInfo.roll = objTelemetry.attitude.roll;
        droneInfo.pitch = objTelemetry.attitude.pitch;          

        // ottenere la mapControllerVehicle associata
        var mapControllerVehicle = droneStatus.mapControllerVehicle;

        mapControllerVehicle.doControlVehicleOnMap(droneInfo.lat, droneInfo.lon,  droneInfo.yaw, isFirstTelemetryValue);

    }

   /**
     * [getNotificationHistoryTelemetry description]
     * @param  {string} queueName    [description]
     * @param  {object} objHistoryTelemetry [description]
     * @return {void}              [
     */
    
    getNotificationHistoryTelemetry(queueName, objTelemetryHistory) {
        console.log('>> getNotificationHistoryTelemetry:', queueName, objTelemetryHistory);

        // var droneStatus = { id: idDrone, status: droneInfo, mapControllerVehicle: mapControllerVehicle };
        var droneStatus = this.mapDronesInfo.get(queueName);

        if(!droneStatus) {
          console.log('DRONE ERASED:', queueName);
          return;
        }
       

        // ottenere la mapControllerVehicle associata
        var mapControllerVehicle = droneStatus.mapControllerVehicle;

        mapControllerVehicle.doWriteHistory(objTelemetryHistory.values);
        
        // cambiare status: droneInfo
        
        var droneInfo = droneStatus.status;

        droneInfo.lat = objTelemetryHistory.lastRecord.lat;
        droneInfo.lon = objTelemetryHistory.lastRecord.lon;
        droneInfo.alt = objTelemetryHistory.lastRecord.alt;

        droneInfo.groundspeed = objTelemetryHistory.lastRecord.groundspeed;

        droneInfo.yaw = objTelemetryHistory.lastRecord.yaw;
        droneInfo.roll = objTelemetryHistory.lastRecord.roll;
        droneInfo.pitch = objTelemetryHistory.lastRecord.pitch;   

    }

   /**
   * [captureLatLongOnMapClick description]
   * @param  {object} latLng [description]
   * @fires ModelController#commandGoto
   */
  
  captureLatLongOnMapClick(latLng) {

    // check if GOTO1 command
  
    if(this.commandStatus == COMMAND.GOTO1) {

        var lat = latLng.lat();
        var lng = latLng.lng();

        console.log('GOTO---> {lat:', lat, ', lng:', lng, '}');

        map.setOptions({ draggableCursor: null });

        /**
         * fromMap:goto event.
         *
         * @event ModelController#commandGoto
         * @type {object}
         * @property {float} lat - latitudo.
         * @property {float} lng - longitudo.
         */
        
        // this.emitEvent('fromMap:goto', [latLng]);

        var eventsController = EventsController.getInstance();

        eventsController.emitGoto(latLng);

        this.commandStatus = COMMAND.NONE;

        // aggiornare view
        
    }

  }

  /**
   * [setCommandGoto1 description]
   */
  
  setCommandGoto1() {

    this.commandStatus = COMMAND.GOTO1;

    map.setOptions({ draggableCursor: 'crosshair' });

  }

  setCommandArm() {

    if(this.commandStatus == COMMAND.GOTO1) {
      map.setOptions({ draggableCursor: null });
    }

    this.commandStatus = COMMAND.ARM;
  }

  setCommandDisarm() {

    if(this.commandStatus == COMMAND.GOTO1) {
      map.setOptions({ draggableCursor: null });
    }

    this.commandStatus = COMMAND.DISARM;
  }

  setCommandTakeoff() {

    if(this.commandStatus == COMMAND.GOTO1) {
      map.setOptions({ draggableCursor: null });
    }

    this.commandStatus = COMMAND.TAKEOFF;
  }

  setCommandLandnow() {

    if(this.commandStatus == COMMAND.GOTO1) {
      map.setOptions({ draggableCursor: null });
    }

    this.commandStatus = COMMAND.LANDNOW;
  }

  setCommandGoto2() {

    if(this.commandStatus == COMMAND.GOTO1) {
      map.setOptions({ draggableCursor: null });
    }

    this.commandStatus = COMMAND.GOTO2;
  }

  setCommandGoto3() {

    if(this.commandStatus == COMMAND.GOTO1) {
      map.setOptions({ draggableCursor: null });
    }

    this.commandStatus = COMMAND.GOTO3;
  }

}

class MapControllerVehicle {

  /**
   * @class MapControllerVehicle
   * @param  {string} idDrone - queue name
   * @param {string} droneType - drone type: CAR, AIRPLANE, BOAT
   */
  
  constructor(idDrone, droneType) {
    this.idDrone = idDrone;
    this.droneType = droneType;
    this.marker = null;
    this.data = [];
    
    this.flightPath = new google.maps.Polyline({
          path: this.data,
          map: map,
          strokeWeight: .5,
          strokeColor: 'green'
        });

   
    this.isObserved = false;
  }

  /**
   * [setDeleteVehicleOnMap description]
   */
  
  setDeleteVehicleOnMap() {

    if (this.marker != null) {
       this.marker.setMap(null);
       this.marker = null;
       // erase flightPath
       this.flightPath.setMap(null);
       this.data = [];
    }
   
  }

  /**
   * [setUnsubscribedVehicleOnMap description]
   * @param {Number} lat - latitudo
   * @param {Number} lon - longitudo
   */
  
  setUnsubscribedVehicleOnMap(lat, lon) {

      var magnitude = 4;  
      var icon = {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: 'red',
              fillOpacity: .2,
              scale: Math.pow(2, magnitude) / 2,
              strokeColor: 'white',
              strokeWeight: .5
          };

      this.marker.setIcon(icon);
  }

  /**
   * [setIsObserved description]
   * @param {boolean} value [description]
   */
  setIsObserved(value) {
    this.isObserved = value;

    var currentIcon = this.marker.getIcon();

    // change icon color
    var currentRotation = currentIcon.rotation;

    var fillColorValue = null;

     if(this.isObserved) {
        fillColorValue = '#990000';
     } else {
        fillColorValue = '#ffad33';
     }

    var icon = {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            fillColor: fillColorValue,
            fillOpacity: 1,
            scale: Math.pow(2, 3.4) / 2,
            strokeColor: 'white',
            strokeWeight: .3,
            rotation: currentRotation 
        };

    this.marker.setIcon(icon);

    // map.panTo(new google.maps.LatLng(newLat, newLon));
    
    if(this.isObserved) {
      map.panTo(this.marker.position);
    }
    
  }
  
  /**
   * [doControlVehicleOnMap Message with coords and status vehicle, so update the map visualization.]
   * @param  {float} lat - [description]
   * @param {float} lon - [description]
   * @param {float} yaw - [description]
   * @param {boolean} isFirstTelemetryValue [description]
   * @return {void}                  [description]
   */
  
  doControlVehicleOnMap(lat, lon, yaw, isFirstTelemetryValue) {

      var newLat = lat;
      var newLon = lon;

      // 'attitude': {'yaw': 2.2328476905822754, 'roll': 0.0015431742649525404, 'pitch': 0.0016542377416044474}

      var yawVal = yaw;
      
     // console.log('MOVING lat:' + newLat + ' - LON: ' + newLon + ', {YAW: ' + yawVal + ', ROLL: ' + rollVal + ', PITCH: ' + pitch + '}');

     this.data.push({ lat: newLat, lng: newLon});

     var fillColorValue = null;

     if(this.isObserved) {
        fillColorValue = '#990000';
     } else {
        fillColorValue = '#ffad33';
     }

      var icon = {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            fillColor: fillColorValue,
            fillOpacity: 1,
            scale: Math.pow(2, 3.4) / 2,
            strokeColor: 'white',
            strokeWeight: .3,
            rotation: Converter.convertRadians(yawVal) 
        };

      if(this.marker == null){
        
        var label = null;

        switch (this.droneType) {
          case DRONE_TYPE.AIRPLANE:
            label = '✈ ';
            break;
          case DRONE_TYPE.CAR:
            label = '🚗 ';
            break;
          case DRONE_TYPE.SHIP:
            label = '🚢 ';
            break;
          case DRONE_TYPE.ROCKET:
            label = '🚀 ';
            break;
          default:
            label = '✈ ';          
            break;
        }

        label = label +  this.idDrone;

        this.marker = new google.maps.Marker({
            position: new google.maps.LatLng(newLat, newLon),
            label: label,
            icon: icon,
            map: map
          });
 
        google.maps.event.addListener(this.marker, 'click', markerClicked.bind(this));

        var bounds = map.getBounds();

        if(bounds) {

          // redefine bounds
          if(isFirstTelemetryValue){
            // discard previous bounds
            bounds = new google.maps.LatLngBounds();
          }
          
          bounds.extend(new google.maps.LatLng(newLat, newLon));

          bounds.extend(new google.maps.LatLng(newLat + 0.3, newLon));
          bounds.extend(new google.maps.LatLng(newLat + 0.3, newLon + 0.3));
          bounds.extend(new google.maps.LatLng(newLat - 0.3, newLon - 0.3));

          var center = bounds.getCenter();
          console.log('>>>>> GET CENTER:', center.lat(), center.lng());

          map.panToBounds(bounds);
        }

          // console.log('ICON FIRST:', icon.rotation);
      } else {
        // update positin
        this.marker.setPosition(new google.maps.LatLng(newLat, newLon));
        this.marker.setIcon(icon);

        
        // console.log('SET ICON:', icon.rotation);
      }
      
      // update flight path
      this.flightPath.setPath(this.data);

      // map.panTo(new google.maps.LatLng(newLat, newLon));
  }

  /**
   * 
   * @param {array} values 
   */

  doWriteHistory(values){

    var lastValue = null;

    if(this.data.length > 0){
      lastValue = this.data.pop();
    }

    values.forEach(function(elem) {

        this.data.push({ lat: elem[1], lng: elem[2]});
    
    }, this);
    
    if(lastValue) {
      this.data.push(lastValue);
    }

    this.flightPath.setPath(this.data);

    if(!lastValue) {
       var lastElem = values.pop();

       if(lastElem){
          this.doControlVehicleOnMap(lastElem[1], lastElem[2], 1, false);
       }
       

    }
    


  }


}

module.exports = {
  ModelControllerMulti: ModelControllerMulti,
  DRONE_TYPE: DRONE_TYPE,
  COMMAND: COMMAND
};
                  
