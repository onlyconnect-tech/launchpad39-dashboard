'use strict';

const ArrayUtils = require('../src/util/arr_utils');

const test = require('tape'); // assign the tape library to the variable "test"

function xtest() {}

test('should return -1 when the value is not present in Array', function (t) {
  
  var arrSrc = ['a', 'b', 'c'];
  var arrDest = [];

  ArrayUtils.renderSame(arrSrc, arrDest);

  t.deepEqual(arrDest, ['a', 'b', 'c'], 'all elements added');
  t.end();
});

test('should return -2 when the value is not present in Array', function (t) {
  
  var arrSrc = [];
  var arrDest = ['a', 'b', 'c'];

  ArrayUtils.renderSame(arrSrc, arrDest);

  t.deepEqual(arrDest, [], 'all elements removed');

  t.end();
});

test('should return -2 when the value is not present in Array', function (t) {
  
  var arrSrc = ['a', 'c'];
  var arrDest = ['a', 'b', 'c'];

  ArrayUtils.renderSame(arrSrc, arrDest);
  
  t.deepEqual(arrDest, ['a', 'c'], 'OK');

  t.end();
});


test('should return -2 when the value is not present in Array', function (t) {
  
  var arrSrc = ['a', 'c', 'd'];
  var arrDest = ['a', 'b', 'c'];

  ArrayUtils.renderSame(arrSrc, arrDest);
  
  t.deepEqual(arrDest, ['a', 'c', 'd'], 'OK');

  t.end();
});

test('should return -2 when the value is not present in Array', function (t) {
  
  var arrSrc = ['a', 'c', 'd'];
  var arrDest = ['a', 'b', 'c'];

  var arrRem = [];
  function callbackRemoveElem(elem) {
      arrRem.push(elem);
  }

  var arrIns = [];
  function callbackInsertedElement(elem) {
      arrIns.push(elem);
  }

  ArrayUtils.renderSame(arrSrc, arrDest, callbackRemoveElem, callbackInsertedElement);
  
  t.deepEqual(arrDest, ['a', 'c', 'd'], 'OK');

  t.deepEqual(arrRem, ['b'], 'OK');
  t.deepEqual(arrIns, ['d'], 'OK');

  t.end();
});

