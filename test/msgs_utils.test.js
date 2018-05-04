'use strict';


const MsgsUtils = require('../src/util/msgs_utils');

const test = require('tape'); // assign the tape library to the variable "test"

test('should return -1 when the value is not present in Array', function (t) {

  t.equal(MsgsUtils.buildQueueName('abc'), '/abc/+'); 
  t.equal(MsgsUtils.buildQueueName('/abc'), '/abc/+'); 
  t.equal(MsgsUtils.buildQueueName('abc/'), '/abc/+'); 
  t.end();
});


// getQueueNamePart

test('should return -1 when the value is not present in Array', function (t) {

  t.equal(MsgsUtils.getQueueNamePart('/abc/telemetry'), '/abc'); 
  t.equal(MsgsUtils.getQueueNamePart('/abc/'), '/abc'); 
  t.equal(MsgsUtils.getQueueNamePart('/abc'), '/abc'); 
  t.end();
});

test('should return -1 when the value is not present in Array', function (t) {

  t.equal(MsgsUtils.normalizeIdDrone('abc/'), '/abc'); 
  t.equal(MsgsUtils.normalizeIdDrone('/abc/'), '/abc'); 
  t.equal(MsgsUtils.normalizeIdDrone('abc'), '/abc'); 
  t.end();
});

