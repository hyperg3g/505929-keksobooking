'use strict';

(function () {
  var MAP_MAX_X = document.querySelector('.map').offsetWidth;
  var MAP_MIN_Y = 130;
  var MAP_MAX_Y = 630;

  var LOW_PRICE = 10000;
  var MID_PRICE = 50000;
  var HIGH_PRICE = 10000000;

  var HOUSE_TYPES = [
    'palace',
    'flat',
    'house',
    'bungalo'
  ];

  var Price = {
    'any': {from: 0, to: HIGH_PRICE},
    'low': {from: 0, to: LOW_PRICE},
    'middle': {from: LOW_PRICE, to: MID_PRICE},
    'high': {from: MID_PRICE, to: HIGH_PRICE}
  };

  window.data = {
    maxMapX: MAP_MAX_X,
    maxMapY: MAP_MAX_Y,
    minMapY: MAP_MIN_Y,
    houseTypes: HOUSE_TYPES,
    price: Price
  };
})();
