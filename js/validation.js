'use strict';

var priceField = document.querySelector('#price');
var timeinField = document.querySelector('#timein');
var timeoutField = document.querySelector('#timeout');
var roomField = document.querySelector('#room_number');
var capacityField = document.querySelector('#capacity');

var changeMinPrice = function (price) {
  priceField.placeholder = price;
  priceField.min = price;
};

var resetOptionsStatus = function () {
  for (var i = 0; i < capacityField.children.length; i++) {
    capacityField.children[i].disabled = true;
  }
};

timeinField.onchange = function () {
  timeoutField.value = timeinField.value;
};

timeoutField.onchange = function () {
  timeinField.value = timeoutField.value;
};

roomField.onchange = function () {
  var roomNumber = roomField.value;
  resetOptionsStatus();
  if (roomNumber === '1') {
    capacityField.children[0].selected = true;
  } else if (roomNumber === '100') {
    capacityField.children[3].selected = true;
  } else {
    for (var i = 0; i < roomNumber; i++) {
      capacityField.children[i].disabled = false;
      capacityField.children[roomNumber - 1].selected = true;
    }
  }
};

resetOptionsStatus();
changeMinPrice(1000);
