'use strict';

var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var MIN_ROOMS = 1;
var MAX_ROOMS = 5;
var MAP_MAX_X = document.querySelector('.map').offsetWidth;
var MAP_MIN_Y = 130;
var MAP_MAX_Y = 630;
var ADS_AMOUNT = 8;
var AvatarsIndexes = [1, 2, 3, 4, 5, 6, 7, 8];
var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];
var TIMES = [12, 13, 14];
var OFFER_TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];
var HOUSE_TYPES = [
  'palace',
  'flat',
  'house',
  'bugalo'
];
var HOUSE_TYPES_MEANING = [
  'Дворец',
  'Квартира',
  'Дом',
  'Бунгало'
];
var FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

var map = document.querySelector('.map');

var removeElementFromArray = function (element, array) {
  return array.splice(array.indexOf(element), 1);
};

var getRandomNumberInRange = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var getRandomElementFromArray = function (array) {
  var randomNumber = Math.floor(Math.random() * array.length);
  return array[randomNumber];
};

var getTitle = function () {
  var title = getRandomElementFromArray(OFFER_TITLES);
  removeElementFromArray(title, OFFER_TITLES);
  return title;
};

var getHouseFeatures = function () {
  var featuresList = FEATURES;
  var houseFeatures = new Array(getRandomNumberInRange(1, featuresList.length));
  for (var i = 0; i < houseFeatures.length; i++) {
    var feature = getRandomElementFromArray(featuresList);
    removeElementFromArray(feature, featuresList);
    houseFeatures[i] = feature;
  }
  return houseFeatures;
};

var getAuthorValue = function () {
  var avatarIndex = getRandomElementFromArray(AvatarsIndexes);
  removeElementFromArray(avatarIndex, AvatarsIndexes);
  return {'avatar': 'img/avatars/user0' + avatarIndex + '.png'};
};

var getOfferValue = function (location) {
  var numberOfRooms = getRandomNumberInRange(MIN_ROOMS, MAX_ROOMS);
  return {
    'title': getTitle(),
    'address': location.x + ', ' + location.y,
    'price': getRandomNumberInRange(MIN_PRICE, MAX_PRICE),
    'type': getRandomElementFromArray(HOUSE_TYPES),
    'rooms': numberOfRooms,
    'guests': getRandomNumberInRange(1, numberOfRooms),
    'checkin': getRandomElementFromArray(TIMES) + ':00',
    'checkout': getRandomElementFromArray(TIMES) + ':00',
    'features': getHouseFeatures(),
    'description': '',
    'photos': PHOTOS
  };
};

var getLocationValue = function () {
  return {
    'x': getRandomNumberInRange(1, MAP_MAX_X),
    'y': getRandomNumberInRange(MAP_MIN_Y, MAP_MAX_Y)
  };
};

var getAd = function () {
  var location = getLocationValue();
  var author = getAuthorValue();
  var offer = getOfferValue(location);
  return {
    'author': author,
    'offer': offer,
    'location': location
  };
};

var getAdsArray = function (amount) {
  var adsArray = new Array(amount);
  for (var i = 0; i < amount; i++) {
    adsArray[i] = getAd();
  }
  return adsArray;
};

var adList = getAdsArray(ADS_AMOUNT);
var pinTemplate = document.querySelector('#pin').content.querySelector('button');
var cardTemplate = document.querySelector('#card').content.querySelector('article');

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
  card.querySelector('.popup__type').innerText = HOUSE_TYPES_MEANING[HOUSE_TYPES.indexOf(offer.type)];
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

var filterForm = document.querySelector('.map__filters');
var adForm = document.querySelector('.ad-form');
var mapMainPin = document.querySelector('.map__pin--main');

var mapActivate = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  enableForm(adForm);
  enableForm(filterForm);
  setPinCoordinates(mapMainPin);
};

var setPinCoordinates = function (pin) {
  var pinCoordX = pin.style.left.replace(/[\D]/g, '');
  var pinCoordY = pin.style.top.replace(/[\D]/g, '');
  adForm.querySelector('input#address').value = pinCoordX + ', ' + pinCoordY;
};

var enableForm = function (form) {
  var fieldsetFields = Array.from(form.getElementsByTagName('fieldset'));
  var selectFields = Array.from(form.getElementsByTagName('select'));
  var fieldsArray = fieldsetFields.concat(selectFields);
  for (var i = 0; i < fieldsArray.length; i++) {
    fieldsArray[i].removeAttribute('disabled');
  }
};

var disableForm = function (form) {
  var fieldsetFields = Array.from(form.getElementsByTagName('fieldset'));
  var selectFields = Array.from(form.getElementsByTagName('select'));
  var fieldsArray = fieldsetFields.concat(selectFields);
  for (var i = 0; i < fieldsArray.length; i++) {
    fieldsArray[i].setAttribute('disabled', 'disabled');
  }
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

  if (topValue < MAP_MIN_Y) {
    topValue = MAP_MIN_Y;
  } else if (topValue > MAP_MAX_Y) {
    topValue = MAP_MAX_Y;
  }

  if (leftValue < 0) {
    leftValue = 0;
  } else if (leftValue > MAP_MAX_X - pinSize.width) {
    leftValue = MAP_MAX_X - pinSize.width;
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

disableForm(adForm);
disableForm(filterForm);
