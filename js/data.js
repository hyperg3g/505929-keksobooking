'use strict';

(function () {
  var MIN_PRICE = 1000;
  var MAX_PRICE = 1000000;
  var MIN_ROOMS = 1;
  var MAX_ROOMS = 5;
  var MAP_MAX_X = document.querySelector('.map').offsetWidth;
  var MAP_MIN_Y = 130;
  var MAP_MAX_Y = 630;
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
  var FEATURES = [
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

  window.data = {
    getAdsArray: getAdsArray,
    maxMapX: MAP_MAX_X,
    maxMapY: MAP_MAX_Y,
    minMapY: MAP_MIN_Y,
    houseTypes: HOUSE_TYPES
  };
})();
