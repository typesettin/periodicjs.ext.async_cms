(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 * classie
 * http://github.amexpub.com/modules/classie
 *
 * Copyright (c) 2013 AmexPub. All rights reserved.
 */

module.exports = require('./lib/classie');

},{"./lib/classie":2}],2:[function(require,module,exports){
/*!
 * classie - class helper functions
 * from bonzo https://github.com/ded/bonzo
 * 
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

/*jshint browser: true, strict: true, undef: true */
/*global define: false */
'use strict';

  // class helper functions from bonzo https://github.com/ded/bonzo

  function classReg( className ) {
    return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
  }

  // classList support for class management
  // altho to be fair, the api sucks because it won't accept multiple classes at once
  var hasClass, addClass, removeClass;

  if (typeof document === "object" && 'classList' in document.documentElement ) {
    hasClass = function( elem, c ) {
      return elem.classList.contains( c );
    };
    addClass = function( elem, c ) {
      elem.classList.add( c );
    };
    removeClass = function( elem, c ) {
      elem.classList.remove( c );
    };
  }
  else {
    hasClass = function( elem, c ) {
      return classReg( c ).test( elem.className );
    };
    addClass = function( elem, c ) {
      if ( !hasClass( elem, c ) ) {
        elem.className = elem.className + ' ' + c;
      }
    };
    removeClass = function( elem, c ) {
      elem.className = elem.className.replace( classReg( c ), ' ' );
    };
  }

  function toggleClass( elem, c ) {
    var fn = hasClass( elem, c ) ? removeClass : addClass;
    fn( elem, c );
  }

  var classie = {
    // full names
    hasClass: hasClass,
    addClass: addClass,
    removeClass: removeClass,
    toggleClass: toggleClass,
    // short names
    has: hasClass,
    add: addClass,
    remove: removeClass,
    toggle: toggleClass
  };

  // transport

  if ( typeof module === "object" && module && typeof module.exports === "object" ) {
    // commonjs / browserify
    module.exports = classie;
  } else {
    // AMD
    define(classie);
  }

  // If there is a window object, that at least has a document property,
  // define classie
  if ( typeof window === "object" && typeof window.document === "object" ) {
    window.classie = classie;
  }
},{}],3:[function(require,module,exports){
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

},{"classie":1}]},{},[3]);
