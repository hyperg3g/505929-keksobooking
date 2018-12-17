'use strict';

(function () {
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
      pin.onclick = window.card.showCard.bind(ad);
    }
    return pin;
  };

  var createPinsNode = function () {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < window.adList.length; i++) {
      var newPin = createPin(window.adList[i]);
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
    var pinCoordX = pin.style.left.replace(/[\D]/g, '');
    var pinCoordY = pin.style.top.replace(/[\D]/g, '');
    document.querySelector('input#address').value = pinCoordX + ', ' + pinCoordY;
  };

  window.pin = {
    setPinCoordinates: setPinCoordinates,
    getPinStyleValue: getPinStyleValue,
    createPinsNode: createPinsNode
  };
})();
