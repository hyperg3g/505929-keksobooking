'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ADS_AMOUNT = 5;

  var pinTemplate = document.querySelector('#pin').content.querySelector('button');

  var createPin = function (ad) {
    var pin = pinTemplate.cloneNode(true);

    if (ad.offer === undefined) {
      pin = undefined;
    } else {
      pin.style.left = ad.location.x + 'px';
      pin.style.top = ad.location.y + 'px';
      pin.querySelector('img').src = ad.author.avatar;
      pin.querySelector('img').alt = ad.offer.title;

      pin.addEventListener('click', function () {
        var lastActivePin = document.querySelector('.map__pin--active');

        if (lastActivePin !== pin) {
          var card = window.card.createCard(ad);
          var onEscPress = function (evt) {
            evt.preventDefault();
            if (evt.keyCode === ESC_KEYCODE) {
              pinCardOff(pin);
              pin.blur();
              window.removeEventListener('keydown', onEscPress);
            }
          };

          card.querySelector('button').onclick = function () {
            pinCardOff(pin);
            window.removeEventListener('keydown', onEscPress);
          };

          pinCardOn(pin, card);
          if (lastActivePin) {
            lastActivePin.classList.remove('map__pin--active');
          }

          window.addEventListener('keydown', onEscPress);
        }
      });
    }
    return pin;
  };

  var pinCardOff = function (pin) {
    pin.classList.remove('map__pin--active');
    window.card.removeCard();
  };

  var pinCardOn = function (pin, card) {
    pin.classList.add('map__pin--active');
    window.card.removeCard();
    window.card.showCard(card);
  };

  var createPinsNode = function (ads) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < ADS_AMOUNT && i < ads.length; i++) {
      var newPin = createPin(ads[i]);
      if (newPin !== undefined) {
        fragment.appendChild(newPin);
      }
    }
    return fragment;
  };

  var getPinStyleValue = function (pin, shift) {
    var pinSize = pin.getBoundingClientRect();
    var leftValue = pin.offsetLeft - shift.x;
    var topValue = pin.offsetTop - shift.y;

    if (topValue < window.data.minMapY) {
      topValue = window.data.minMapY;
    } else if (topValue > window.data.maxMapY) {
      topValue = window.data.maxMapY;
    }

    if (leftValue < 0) {
      leftValue = 0;
    } else if (leftValue > window.data.maxMapX - pinSize.width) {
      leftValue = window.data.maxMapX - pinSize.width;
    }

    return {
      x: leftValue,
      y: topValue
    };
  };

  var setPinCoordinates = function (pin) {
    var pinCoordX = Number(pin.style.left.replace(/[\D]/g, '')) + Math.floor(pin.offsetWidth / 2);
    var pinCoordY = Number(pin.style.top.replace(/[\D]/g, '')) + pin.offsetHeight;
    document.querySelector('input#address').value = pinCoordX + ', ' + pinCoordY;
  };

  window.pin = {
    setPinCoordinates: setPinCoordinates,
    getPinStyleValue: getPinStyleValue,
    createPinsNode: createPinsNode
  };
})();
