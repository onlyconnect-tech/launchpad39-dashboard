'use strict';

var test = require('tape'); // assign the tape library to the variable "test"

test('should return -1 when the value is not present in Array', function (t) {
  t.equal(-1, [1,2,3].indexOf(4)); // 4 is not present in this array so passes

  var arr1 = ['/001/001/', '/002/002', '/003/003'];

  console.log(typeof arr1);
  var strArr1 = JSON.stringify(arr1);
  console.log(typeof strArr1);
  console.log('>>>>', strArr1);
  var objArr1 = JSON.parse(strArr1);
  console.log(typeof objArr1);
  t.deepEqual(objArr1, arr1, "OK");
  t.end();
});