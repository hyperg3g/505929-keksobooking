'use strict';

(function () {
  var MAP_MAX_X = document.querySelector('.map').offsetWidth;
  var MAP_MIN_Y = 130;
  var MAP_MAX_Y = 630;

  var HOUSE_TYPES = [
    'palace',
    'flat',
    'house',
    'bungalo'
  ];

  window.data = {
    maxMapX: MAP_MAX_X,
    maxMapY: MAP_MAX_Y,
    minMapY: MAP_MIN_Y,
    houseTypes: HOUSE_TYPES
  };
})();
