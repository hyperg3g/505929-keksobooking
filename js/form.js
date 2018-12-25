'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;

  var filterForm = document.querySelector('.map__filters');
  var House = {
    type: filterForm.querySelector('#housing-type').value,
    price: filterForm.querySelector('#housing-price').value,
    rooms: filterForm.querySelector('#housing-rooms').value,
    guests: filterForm.querySelector('#housing-guests').value,
    features: []
  };

  var enableForm = function (form) {
    var fieldsetFields = Array.from(form.getElementsByTagName('fieldset'));
    var selectFields = Array.from(form.getElementsByTagName('select'));
    var fields = fieldsetFields.concat(selectFields);
    for (var i = 0; i < fields.length; i++) {
      fields[i].removeAttribute('disabled');
    }
  };

  var disableForm = function (form) {
    var fieldsetFields = Array.from(form.getElementsByTagName('fieldset'));
    var selectFields = Array.from(form.getElementsByTagName('select'));
    var fields = fieldsetFields.concat(selectFields);
    for (var i = 0; i < fields.length; i++) {
      fields[i].setAttribute('disabled', 'disabled');
    }
  };

  var updateProperties = function (evt) {
    var target = evt.target;
    var targetKey = target.name.replace('housing-', '');
    if (target.tagName === 'INPUT') {
      var elemIndex = House[targetKey].indexOf(target.value);
      if (elemIndex === -1) {
        House[targetKey].push(target.value);
      } else {
        House[targetKey].splice(elemIndex, 1);
      }
    } else {
      House[targetKey] = target.value;
    }
  };

  var isContainItems = function (items, array) {
    return items.every(function (elem) {
      return array.includes(elem);
    });
  };

  var updatePins = function (ads) {
    var mapPins = document.querySelector('.map__pins');
    var pins = Array.from(document.getElementsByClassName('map__pin'));
    var prevCard = document.querySelector('.map__card');
    for (var i = 1; i < pins.length; i++) {
      mapPins.removeChild(pins[i]);
    }

    if (prevCard !== null) {
      document.querySelector('.map').removeChild(prevCard);
    }

    var newPinsNode = window.pin.createPinsNode(ads);
    mapPins.appendChild(newPinsNode);
  };

  var adCompare = function (elem) {
    return (
      (elem.offer.type === House.type || House.type === 'any') &&
      (elem.offer.rooms === Number(House.rooms) || House.rooms === 'any') &&
      (elem.offer.guests === Number(House.guests) || House.guests === 'any') &&
      (elem.offer.price >= window.data.Price[House.price].from && elem.offer.price <= window.data.Price[House.price].to) &&
      (isContainItems(House.features, elem.offer.features) || House.features === [])
    );
  };

  filterForm.addEventListener('change', function (evt) {
    evt.preventDefault();
    updateProperties(evt);

    var lastTimeout;
    var filtered = window.adList.filter(adCompare);

    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(function () {
      updatePins(filtered);
    }, DEBOUNCE_INTERVAL);
  });

  window.form = {
    disableForm: disableForm,
    enableForm: enableForm
  };
})();
