'use strict';

(function () {
  var ESC_KEYCODE = 27;

  var adForm = document.querySelector('.ad-form');
  var priceField = document.querySelector('#price');
  var timeInField = document.querySelector('#timein');
  var timeOutField = document.querySelector('#timeout');
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

  timeInField.onchange = function () {
    timeOutField.value = timeInField.value;
  };

  timeOutField.onchange = function () {
    timeInField.value = timeOutField.value;
  };

  roomField.onchange = function () {
    var roomNumber = roomField.value;
    if (roomNumber === '1') {
      resetOptionsStatus();
      capacityField.children[0].disabled = false;
      capacityField.children[0].selected = true;
      capacityField.value = roomNumber;
    } else if (roomNumber === '100') {
      resetOptionsStatus();
      capacityField.children[3].disabled = false;
      capacityField.children[3].selected = true;
      capacityField.value = 0;
    } else {
      resetOptionsStatus();
      for (var i = 0; i < roomNumber; i++) {
        capacityField.children[i].disabled = false;
      }
      capacityField.children[roomNumber - 1].selected = true;
      capacityField.value = roomNumber;
    }
  };

  var successTemplate = document.querySelector('#success').content.querySelector('div');
  var errorTemplate = document.querySelector('#error').content.querySelector('div');
  var main = document.querySelector('main');

  var successHandler = function () {
    var success = successTemplate.cloneNode(true);

    adForm.reset();
    main.appendChild(success);

    var mapResetHandler = function () {
      window.map.mapDeactivate();
      main.removeChild(success);
    };

    success.addEventListener('click', mapResetHandler);

    window.addEventListener('keydown', function mapResetOnEscPressed(evt) {
      evt.preventDefault();
      if (evt.keyCode === ESC_KEYCODE) {
        mapResetHandler();
      }
      window.removeEventListener('keydown', mapResetOnEscPressed);
    });
  };

  var errorHandler = function (message) {
    var error = errorTemplate.cloneNode(true);
    var retryButton = error.querySelector('button');

    var mapResetHandler = function () {
      main.removeChild(error);
    };

    main.appendChild(error);
    error.querySelector('.error__message').innerText = 'Ошибка загрузки объявления: ' + message;

    error.addEventListener('click', mapResetHandler);
    retryButton.addEventListener('click', mapResetHandler);
    window.addEventListener('keydown', function mapResetOnEscPressed(evt) {
      evt.preventDefault();
      if (evt.keyCode === ESC_KEYCODE) {
        mapResetHandler();
      }
      window.removeEventListener('keydown', mapResetOnEscPressed);
    });

  };

  adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(adForm), successHandler, errorHandler);
  });

  adForm.querySelector('.ad-form__reset').addEventListener('click', window.map.mapDeactivate);

  changeMinPrice(1000);

  window.validation = {
    changeMinPrice: changeMinPrice
  };
})();
