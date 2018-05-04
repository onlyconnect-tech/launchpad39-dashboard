'use strict';

require('core-js/fn/map'); // sets up global Map
require('core-js/fn/promise'); // sets up global Promise

const Joi = require('joi-browser');

/*
'[{"nms":1412638168724, "geoJSON":{"type":"Point","coordinates":[-94.57853,39.09972]} }]'
 */

class MissionValidator {

	static validateJsonObj(jsonObj) {

		var objSchema = Joi.object().keys({
			nms: Joi.number(),
  			// serviceName: Joi.string().required()
  			geoJSON: Joi.object().keys({
  				type: Joi.string().required(),
  				coordinates: Joi.array().items(Joi.number())
  			})
		});

		var schema = Joi.array().items(objSchema);

		console.log('jsonObj:', jsonObj);

		var test = Joi.validate(jsonObj, schema);

		return test;
	}
}

module.exports = MissionValidator;
