'use strict';

(function () {
  var SUCCESS_CODE = 200;

  var load = function (onLoad, onError) {
    var URL = 'https://js.dump.academy/keksobooking/data';

    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_CODE) {
        onLoad(xhr.response);
      } else {
        onError(xhr.status);
      }
    });

    xhr.open('GET', URL);
    xhr.send();
  };

  var save = function (data, onLoad, onError) {
    var URL = 'https://js.dump.academy/keksobooking';

    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_CODE) {
        onLoad();
      } else {
        onError(xhr.statusText);
      }
    });

    xhr.open('POST', URL);
    xhr.send(data);
  };

  window.backend = {
    load: load,
    save: save
  };
})();
