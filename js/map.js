'use strict';

(function () {
  var ESC_KEYCODE = 27;

  var map = document.querySelector('.map');
  var filterForm = document.querySelector('.map__filters');
  var adForm = document.querySelector('.ad-form');
  var mapMainPin = document.querySelector('.map__pin--main');

  var successHandler = function (ads) {
    window.adList = ads;
    window.form.enableForm(filterForm);
  };

  var errorTemplate = document.querySelector('#error').content.querySelector('div');
  var main = document.querySelector('main');

  var errorHandler = function (message) {
    var error = errorTemplate.cloneNode(true);
    var retryButton = error.querySelector('button');

    main.appendChild(error);
    error.querySelector('.error__message').innerText = 'Ошибка загрузки: ' + message;
    retryButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      location.reload();
    });
  };

  var mapActivate = function () {
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    window.form.enableForm(adForm);
    window.pin.setPinCoordinates(mapMainPin);
  };

  var getMouseCoordsOnMap = function (mouseEvt) {
    var mapCoords = map.getBoundingClientRect();
    var mouseCoords = {
      x: mouseEvt.clientX - mapCoords.x,
      y: mouseEvt.clientY - mapCoords.y
    };
    return mouseCoords;
  };

  var mapActivated = false;

  mapMainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = getMouseCoordsOnMap(evt);

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      window.pin.setPinCoordinates(mapMainPin);

      if (!mapActivated) {
        var adPins = window.pin.createPinsNode(window.adList);
        mapActivated = true;

        mapActivate();
        document.querySelector('.map__pins').appendChild(adPins);
      }

      var moveCoords = getMouseCoordsOnMap(moveEvt);
      var shift = {
        x: startCoords.x - moveCoords.x,
        y: startCoords.y - moveCoords.y
      };
      var newStyleCoords = window.pin.getPinStyleValue(mapMainPin, shift);

      startCoords = {
        x: moveCoords.x,
        y: moveCoords.y
      };

      mapMainPin.style.zIndex += '1';
      mapMainPin.style.top = newStyleCoords.y + 'px';
      mapMainPin.style.left = newStyleCoords.x + 'px';
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      mapMainPin.style.zIndex = '0';
      map.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    map.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  });

  map.addEventListener('keydown', function (evt) {
    evt.preventDefault();
    var card = document.querySelector('.map__card');
    if (card !== null && evt.keyCode === ESC_KEYCODE) {
      card.style.display = 'none';
    }
  });

  window.form.disableForm(adForm);
  window.form.disableForm(filterForm);
  window.backend.load(successHandler, errorHandler);
})();
