'use strict';

var classie = require('classie'),
	request = require('superagent'),
	childHtmlContainer,
	ctTableBody,
	childTaxonomy,
	doctypename,
	doctypenamelink;

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


var getAttributeChildHtml = function (attribute, makelink) {
	var returnHtml = '<li>';
	if (makelink) {
		returnHtml += '<a href="/p-admin/content/' + doctypename + '/' + attribute.name + '">' + attribute.title + '</a>';
	}
	else {
		returnHtml += attribute.title;
	}
	if (attribute.childDocs) {
		for (var x in attribute.childDocs) {
			returnHtml += '<ul>' + getAttributeChildHtml(attribute.childDocs[x], true) + '</ul>';
		}
	}
	returnHtml += '</li>';
	return returnHtml;
};

var getChildrenHtml = function (attributes) {
	var returnHtml = '<ul>';
	returnHtml += getAttributeChildHtml(attributes, true);
	returnHtml += '</ul>';

	return returnHtml;
};


var getChildTaxonomy = function () {
	childHtmlContainer = document.getElementById('ts-child-attributes');
	doctypenamelink = childHtmlContainer.getAttribute('data-taxonomytype');
	doctypename = doctypenamelink;
	request
		.get('/p-admin/content/' + doctypenamelink + '/' + childHtmlContainer.getAttribute('data-taxonomydocid') + '/children')
		.query({
			format: 'json'
		})
		.set('Accept', 'application/json')
		.end(function (error, res) {
			if (res.error) {
				error = res.error;
			}
			if (error) {
				console.error(error);
			}
			else {
				if (res.body && res.body[doctypenamelink + 'withchildren']) {
					var childtaxdocs = res.body[doctypenamelink + 'withchildren'];
					childHtmlContainer.innerHTML = getChildrenHtml(childtaxdocs);
				}
				else {
					childHtmlContainer.innerHTML = 'no child ' + doctypenamelink;
				}
			}
		});
};

var initAdvancedCodemirror = function () {

	if (window.StylieTab && window.StylieTab['dbseed-tabs']) {
		window.StylieTab['dbseed-tabs'].on('tabsShowIndex', function ( /*idex*/ ) {
			if (window.codeMirrors && window.codeMirrors['genericdoc-codemirror']) {
				window.codeMirrors['genericdoc-codemirror'].refresh();
			}
		});
	}


};

var init = function () {
	ctTableBody = document.getElementById('ct-t-body');
	childTaxonomy = document.getElementById('ts-child-taxonomy');
	// window.ajaxFormEventListers('._pea-ajax-form');
	if (ctTableBody) {
		ctTableBody.addEventListener('click', tableClickHandler, false);
	}
	if (childTaxonomy) {
		getChildTaxonomy();
	}
	initAdvancedCodemirror();
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
