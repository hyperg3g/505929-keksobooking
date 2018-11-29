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
var Photos = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var map = document.querySelector('.map');
var mapFilter = document.querySelector('.map__filters-container');
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
    'type': getRandomElementFromArray(houseTypes),
    'rooms': numberOfRooms,
    'guests': getRandomNumberInRange(1, numberOfRooms),
    'checkin': getRandomElementFromArray(times) + ':00',
    'checkout': getRandomElementFromArray(times) + ':00',
    'features': getHouseFeatures(),
    'description': '',
    'photos': Photos
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

var fillCardInfo = function (card, offer) {
  card.querySelector('.popup__title').innerText = offer.title;
  card.querySelector('.popup__text--address').innerText = offer.address;
  card.querySelector('.popup__text--price').innerText = offer.price + '₽/ночь';
  card.querySelector('.popup__type').innerText = houseTypesMeaning[houseTypes.indexOf(offer.type)];
  card.querySelector('.popup__text--capacity').innerText = offer.rooms + ' комнаты для ' + offer.guests + ' гостей';
  card.querySelector('.popup__text--time').innerText = 'Заезд после ' + offer.checkin + ', выезд до ' + offer.checkout;
  card.querySelector('.popup__description').innerText = offer.description;
  return card;
};

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

var createCard = function () {
  var ad = adList[0];
  var card = cardTemplate.cloneNode(true);
  fillCardInfo(card, ad.offer);
  fillCardFeatures(card, ad.offer.features);
  fillCardPhotos(card, ad.offer.photos);
  card.querySelector('.popup__avatar').src = ad.author.avatar;
  return card;
};

map.classList.remove('map--faded');
map.querySelector('.map__pins').appendChild(createPinsNode());
map.insertBefore(createCard(), mapFilter);