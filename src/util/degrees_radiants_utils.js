'use strict';

/**
 * Utility class for conversion from radiants to degrees and viceversa.
 * 
 */

class Converter {
  
  static  convertRadians(radians) {
  	if(radians!= null)
    	return radians * 180 / Math.PI;

    return 0;
	}	

  static convertDegrees(degrees) {
  	return degrees * Math.PI / 180;
	}
}


module.exports = Converter;