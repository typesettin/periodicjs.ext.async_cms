'use strict';

var classie = require('classie'),
	ctTableBody;

var tableClickHandler = function (e) {
	var eTarget = e.target,
		nameInputElement = document.getElementById('remove-item-name');
	// console.log('tableClickHandler eTarget', eTarget);
	// console.log('tableClickHandler classie.has(eTarget, \'edit-content-type-button\')', classie.has(eTarget, 'edit-content-type-button'));
	if (classie.has(eTarget, 'edit-content-type-button')) {
		// var evt = document.createEvent('Event');
		// evt.initEvent('submit', true, false);
		nameInputElement.value = eTarget.value;
		// document.getElementById('contenttype-remove-form').dispatchEvent(evt);
		// 
		window.AdminFormies['contenttype-remove-form'].submit();
		// document.getElementById('contenttype-remove-form').submit();
	}
};

var init = function () {
	ctTableBody = document.getElementById('ct-t-body');
	// window.ajaxFormEventListers('._pea-ajax-form');
	if (ctTableBody) {
		ctTableBody.addEventListener('click', tableClickHandler, false);
	}
};

// window.RemoveContentTypeRowResult = function ( /* AjaxResponseObject */ ) {
// 	var nameInputElementVal = document.getElementById('remove-item-name').value,
// 		rowElement = document.getElementById('attr-name-val-' + nameInputElementVal);
// 	rowElement.parentElement.removeChild(rowElement);
// 	// console.log("rowElement",rowElement);
// };
// window.setItemToRemove = function ( /* etarget */ ) {

// 	console.log('setItemToRemove');
// 	var nameInputElement = document.getElementById('remove-item-name');
// };

// window.removeContentTypeRow = function (deleteData) {
// 	var rowElement = document.getElementById('contenttype-tr-' + deleteData._id);
// 	rowElement.parentElement.removeChild(rowElement);
// };
if (typeof window.domLoadEventFired !== 'undefined') {
	init();
}
else {
	window.addEventListener('load', init, false);
}
