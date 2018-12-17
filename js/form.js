'use strict';

(function () {
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

  window.form = {
    disableForm: disableForm,
    enableForm: enableForm
  };
})();
