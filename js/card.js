'use strict';

(function () {
  var HOUSE_TYPES_MEANING = [
    'Дворец',
    'Квартира',
    'Дом',
    'Бунгало'
  ];

  var map = document.querySelector('.map');
  var cardTemplate = document.querySelector('#card').content.querySelector('article');

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
    if (featuresArray[0] === null) {
      card.querySelector('.popup__features').style.display = 'none';
    } else {
      for (var i = 0; i < featuresArray.length; i++) {
        var li = document.createElement('li');
        li.className = 'popup__feature popup__feature--' + featuresArray[i];
        card.querySelector('.popup__features').appendChild(li);
      }
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

  window.card = {
    showCard: showCard
  };
})();
