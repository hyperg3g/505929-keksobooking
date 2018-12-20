'use strict';

(function () {
  var filterForm = document.querySelector('.map__filters');
  var house = {
    type: filterForm.querySelector('#housing-type').value,
    price: filterForm.querySelector('#housing-price').value,
    rooms: filterForm.querySelector('#housing-rooms').value,
    guests: filterForm.querySelector('#housing-guests').value,
    features: []
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

  var updateProperties = function (evt) {
    var target = evt.target;
    var targetKey = target.name.replace('housing-', '');
    if (target.tagName === 'INPUT') {
      var elemIndex = house[targetKey].indexOf(target.value);
      if (elemIndex === -1) {
        house[targetKey].push(target.value);
      } else {
        house[targetKey].splice(elemIndex, 1);
      }
    } else {
      house[targetKey] = target.value;
    }
  };

  var isContainItems = function (items, array) {
    return items.every(function (elem) {
      return array.includes(elem);
    });
  };

  var updatePins = function (ads) {
    var mapPins = document.querySelector('.map__pins');
    var pinsNode = Array.from(document.getElementsByClassName('map__pin'));
    var prevCard = document.querySelector('.map__card');
    for (var i = 1; i < pinsNode.length; i++) {
      mapPins.removeChild(pinsNode[i]);
    }

    if (prevCard !== null) {
      document.querySelector('.map').removeChild(prevCard);
    }
    var newPinsNode = window.pin.createPinsNode(ads);
    mapPins.appendChild(newPinsNode);
  };

  var comparer = function (elem) {
    return (
      (elem.offer.type === house.type || house.type === 'any') &&
      (elem.offer.rooms === Number(house.rooms) || house.rooms === 'any') &&
      (elem.offer.guests === Number(house.guests) || house.guests === 'any') &&
      (elem.offer.price >= window.data.price[house.price].from && elem.offer.price <= window.data.price[house.price].to) &&
      (isContainItems(house.features, elem.offer.features) || house.features === [])
    );
  };

  filterForm.addEventListener('change', function (evt) {
    evt.preventDefault();
    updateProperties(evt);

    var filtered = window.adList.filter(comparer);
    updatePins(filtered);
  });

  window.form = {
    disableForm: disableForm,
    enableForm: enableForm
  };
})();
