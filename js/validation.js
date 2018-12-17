'use strict';

(function () {
  var adForm = document.querySelector('.ad-form');
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
    setTimeout(function () {
      main.removeChild(success);
    }, 1500);
  };

  var errorHandler = function (message) {
    var error = errorTemplate.cloneNode(true);
    var retryButton = error.querySelector('button');

    main.appendChild(error);
    error.querySelector('.error__message').innerText = 'Ошибка загрузки объявления: ' + message;
    retryButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      main.removeChild(error);
    });
  };

  adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(adForm), successHandler, errorHandler);
  });

  changeMinPrice(1000);

  window.validation = {
    changeMinPrice: changeMinPrice
  };
})();
