'use strict';

var map = document.querySelector('.map');
var mapFilter = document.querySelector('.map__filters-container');
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var MIN_ROOMS = 1;
var MAX_ROOMS = 5;
var MAP_MAX_X = map.offsetWidth;
var MAP_MIN_Y = 130;
var MAP_MAX_Y = 630;
var ADS_AMOUNT = 8;
var avatarsIndexes = [1, 2, 3, 4, 5, 6, 7, 8];
var times = [12, 13, 14];
var offerTitles = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];
var houseTypes = [
  'palace',
  'flat',
  'house',
  'bugalo'
];
var houseTypesMeaning = [
  'Дворец',
  'Квартира',
  'Дом',
  'Бунгало'
];
var features = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];
var photos = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

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
  var title = getRandomElementFromArray(offerTitles);
  removeElementFromArray(title, offerTitles);
  return title;
};

var getHouseFeatures = function () {
  var featuresList = features;
  var houseFeatures = new Array(getRandomNumberInRange(1, featuresList.length));
  for (var i = 0; i < houseFeatures.length; i++) {
    var feature = getRandomElementFromArray(featuresList);
    removeElementFromArray(feature, featuresList);
    houseFeatures[i] = feature;
  }
  return houseFeatures;
};

var getAuthorValue = function () {
  var avatarIndex = getRandomElementFromArray(avatarsIndexes);
  removeElementFromArray(avatarIndex, avatarsIndexes);
  return {'avatar': 'img/avatars/user0' + avatarIndex + '.png'};
};

var getOfferValue = function (location) {
  var numberOfRooms = getRandomNumberInRange(MIN_ROOMS, MAX_ROOMS);
  return {
    'title': getTitle(),
    'address': location.x + ', ' + location.y,
    'price': getRandomNumberInRange(MIN_PRICE, MAX_PRICE),
    'type': getRandomElementFromArray(houseTypes),
    'rooms': numberOfRooms,
    'guests': getRandomNumberInRange(1, numberOfRooms),
    'checkin': getRandomElementFromArray(times) + ':00',
    'checkout': getRandomElementFromArray(times) + ':00',
    'features': getHouseFeatures(),
    'description': '',
    'photos': photos
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
    fragment.appendChild(pin);
  }
  return fragment;
};

var createCard = function () {
  var ad = adList[0];
  var card = cardTemplate.cloneNode(true);
  card.querySelector('.popup__title').innerText = ad.offer.title;
  card.querySelector('.popup__text--address').innerText = ad.offer.address;
  card.querySelector('.popup__text--price').innerText = ad.offer.price + '₽/ночь';
  card.querySelector('.popup__type').innerText = houseTypesMeaning[houseTypes.indexOf(ad.offer.type)];
  card.querySelector('.popup__text--capacity').innerText = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
  card.querySelector('.popup__text--time').innerText = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
  for (var i = 0; i < ad.offer.features.length; i++) {
    var li = document.createElement('li');
    li.className = 'popup__feature popup__feature--' + ad.offer.features[i];
    card.querySelector('.popup__features').appendChild(li);
  }
  for (i = 0; i < ad.offer.photos.length; i++) {
    var img = document.createElement('img');
    img.className = 'popup__photo';
    img.src = ad.offer.photos[i];
    img.style.width = '45px';
    img.style.height = '40px';
    img.alt = 'Фотография жилья';
    card.querySelector('.popup__photos').appendChild(img);
  }
  card.querySelector('.popup__description').innerText = ad.offer.description;
  card.querySelector('.popup__avatar').src = ad.author.avatar;
  return card;
};

map.classList.remove('map--faded');
map.querySelector('.map__pins').appendChild(createPinsNode());
map.insertBefore(createCard(), mapFilter);
