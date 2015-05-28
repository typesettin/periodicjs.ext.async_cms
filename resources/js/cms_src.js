'use strict';
var ejs = require('ejs'),
	content_attribute_template,
	content_attribute_HTML,
	content_attribute_content_html;

window.refresh_content_attributes_media = function (data) {
	var genericdoc = data.body.data.doc;
	content_attribute_HTML = ejs.render(content_attribute_template, {
		genericdoc: genericdoc
	});
	content_attribute_content_html.innerHTML = content_attribute_HTML;

	if (document.querySelectorAll('.medialistcheckbox').length !== genericdoc.assets.length) {
		console.log('document.querySelectorAll(.medialistcheckbox).length', document.querySelectorAll('.medialistcheckbox').length);
		console.log('genericdoc.assets.length', genericdoc.assets.length);
		// console.log('do a window refresh');
		window.adminRefresh();
	}
};

var init = function () {
	ejs.delimiter = '?';
	content_attribute_template = document.querySelector('#ct-attr-template').innerHTML;
	content_attribute_content_html = document.querySelector('#doc-ct-attr');
	// console.log('content_attribute_template', content_attribute_template);
};

if (typeof window.domLoadEventFired !== 'undefined') {
	init();
}
else {
	window.addEventListener('load', init, false);
}
