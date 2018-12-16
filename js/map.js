'use strict';

(function () {
  var ADS_AMOUNT = 8;
  var HOUSE_TYPES_MEANING = [
    'Дворец',
    'Квартира',
    'Дом',
    'Бунгало'
  ];

  var map = document.querySelector('.map');
  var adList = window.data.getAdsArray(ADS_AMOUNT);
  var pinTemplate = document.querySelector('#pin').content.querySelector('button');
  var cardTemplate = document.querySelector('#card').content.querySelector('article');
  var filterForm = document.querySelector('.map__filters');
  var adForm = document.querySelector('.ad-form');
  var mapMainPin = document.querySelector('.map__pin--main');

  var createPinsNode = function () {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < ADS_AMOUNT; i++) {
      var pin = pinTemplate.cloneNode(true);
      pin.style.left = adList[i].location.x + 'px';
      pin.style.top = adList[i].location.y + 'px';
      pin.querySelector('img').src = adList[i].author.avatar;
      pin.querySelector('img').alt = adList[i].offer.title;
      pin.onclick = showCard.bind(adList[i]);
      fragment.appendChild(pin);
    }
    return fragment;
  };

  var createCard = function (ad) {
    var card = cardTemplate.cloneNode(true);
    fillCardInfo(card, ad.offer);
    fillCardFeatures(card, ad.offer.features);
    fillCardPhotos(card, ad.offer.photos);
    card.querySelector('.popup__avatar').src = ad.author.avatar;
    card.querySelector('button').onclick = function () {
      card.style.display = 'none';
    };
    return card;
  };

  var showCard = function () {
    var card = createCard(this); // eslint-disable-line no-invalid-this
    var prevCard = document.querySelector('.map__card');
    if (prevCard !== null) {
      map.removeChild(prevCard);
    }
    map.insertBefore(card, document.querySelector('.map__filters-container'));
  };

  var fillCardInfo = function (card, offer) {
    card.querySelector('.popup__title').innerText = offer.title;
    card.querySelector('.popup__text--address').innerText = offer.address;
    card.querySelector('.popup__text--price').innerText = offer.price + '₽/ночь';
    card.querySelector('.popup__type').innerText = HOUSE_TYPES_MEANING[window.data.houseTypes.indexOf(offer.type)];
    card.querySelector('.popup__text--capacity').innerText = offer.rooms + ' комнаты для ' + offer.guests + ' гостей';
    card.querySelector('.popup__text--time').innerText = 'Заезд после ' + offer.checkin + ', выезд до ' + offer.checkout;
    card.querySelector('.popup__description').innerText = offer.description;
    return card;
  };

  var fillCardFeatures = function (card, featuresArray) {
    for (var i = 0; i < featuresArray.length; i++) {
      var li = document.createElement('li');
      li.className = 'popup__feature popup__feature--' + featuresArray[i];
      card.querySelector('.popup__features').appendChild(li);
    }
    return card;
  };

  var fillCardPhotos = function (card, photos) {
    for (var i = 0; i < photos.length; i++) {
      var img = document.createElement('img');
      img.className = 'popup__photo';
      img.src = photos[i];
      img.style.width = '45px';
      img.style.height = '40px';
      img.alt = 'Фотография жилья';
      card.querySelector('.popup__photos').appendChild(img);
    }
    return card;
  };

  var mapActivate = function () {
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    window.form.enableForm(adForm);
    window.form.enableForm(filterForm);
    setPinCoordinates(mapMainPin);
  };

  var setPinCoordinates = function (pin) {
    var pinCoordX = pin.style.left.replace(/[\D]/g, '');
    var pinCoordY = pin.style.top.replace(/[\D]/g, '');
    adForm.querySelector('input#address').value = pinCoordX + ', ' + pinCoordY;
  };

  var getMouseCoordsOnMap = function (mouseEvt) {
    var mapCoords = map.getBoundingClientRect();
    var mouseCoords = {
      x: mouseEvt.clientX - mapCoords.x,
      y: mouseEvt.clientY - mapCoords.y
    };
    return mouseCoords;
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

  var mapActivated = false;

  mapMainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = getMouseCoordsOnMap(evt);

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      setPinCoordinates(mapMainPin);

      if (!mapActivated) {
        var adPins = createPinsNode();
        mapActivated = true;

        mapActivate();
        document.querySelector('.map__pins').appendChild(adPins);
      }

      var moveCoords = getMouseCoordsOnMap(moveEvt);
      var shift = {
        x: startCoords.x - moveCoords.x,
        y: startCoords.y - moveCoords.y
      };
      var newStyleCoords = getPinStyleValue(mapMainPin, shift);

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

  window.form.disableForm(adForm);
  window.form.disableForm(filterForm);
})();
