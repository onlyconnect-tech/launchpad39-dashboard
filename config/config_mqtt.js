'use strict';


/**
 * Configuration file for mqtt connection.
 * 
 * @typedef ConfigMqtt
 * @type {Object}
 * @property {string} endpoint The endpoint URL.
 * @property {string} accessKey The AWS accessKey.
 * @property {string} secretKey The AWS secretKey.
 * @property {string} regionName The AWS regionName.
 */

const settings = {
	endpoint: '{{ENDPOINT}}',
	accessKey: '{{ACCESS_KEY}}',
	secretKey: '{{SECRET_KEY}}',
	regionName: '{{REGION_NAME}}'
};

module.exports =  settings;  