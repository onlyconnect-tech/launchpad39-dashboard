'use strict';

const MissionValidator = require('../src/util/mission_validator');

var test = require('tape'); // assign the tape library to the variable "test"

test('should return -1 when the value is not present in Array', function (t) {
	
  var strJSON = '[{"nms":1412638168724, "geoJSON":{"type":"Point","coordinates":[-94.57853,39.09972]} }, ' +
  				'{"nms":1412638168724, "geoJSON":{"type":"Point","coordinates":[-97.57853,45.09972]} }]';

  var testResult = null;

  try {

	var jsonObj = JSON.parse(strJSON);

	testResult = MissionValidator.validateJsonObj(jsonObj);

	console.log('TEST:', testResult);

  } catch(exc) {
	if (exc instanceof SyntaxError) {
		console.error('CATCHED:', exc);
	} else {
		console.error('OTHER ERROR:', exc);
	}
  }

  t.equal(null, testResult.error); // 4 is not present in this array so passes
  t.end();
});




