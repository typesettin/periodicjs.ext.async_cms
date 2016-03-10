'use strict';

var moment = require('moment'),
Moment = moment,
	path = require('path'),
	pluralize = require('pluralize');
pluralize.addIrregularRule('category', 'categories');

var cms_default_responsive_collapse = function (options) {
	var path_to_content = options.path_to_content || 'content',
		defaultOptions = {
			editlink: '/' + options.adminPath + '/'+path_to_content+'/' + options.model_name + '/|||_id|||/edit',
			deletelink: '/' + options.adminPath + '/'+path_to_content+'/' + options.model_name + '/|||_id|||/delete',
			deleterefreshlink: '/' + options.adminPath + '/'+path_to_content+'/' + pluralize.plural(options.model_name) + '/'
		};
	return function (data_item) {
		var editlink = defaultOptions.editlink.replace('|||_id|||', data_item._id);
		var deletelink = defaultOptions.deletelink.replace('|||_id|||', data_item._id);
		var drcHTML = '<div class="ts-pull-right">';
		drcHTML += '<a href="' + editlink + '" class="async-admin-ajax-link" data-ajax-href="' + editlink + '"><img src="/extensions/periodicjs.ext.asyncadmin/img/icons/doc_edit_three.svg" alt="edit" class="ts-icon async-admin-ajax-link" data-ajax-href="' + editlink + '"/></a>';
		drcHTML += '<a class="ts-button-error-color ts-dialog-delete"  data-href="' + deletelink + '" data-deleted-redirect-href="' + options.deleterefreshlink + '" ><img src="/extensions/periodicjs.ext.asyncadmin/img/icons/doc_delete.svg" class="ts-icon  ts-dialog-delete"  data-href="' + deletelink + '" data-deleted-redirect-href="' + defaultOptions.deleterefreshlink + '" alt="delete" /></a>';
		drcHTML += '</div>';
		drcHTML += data_item.name + ' <small class="ts-text-divider-text-color">(' + new Moment(data_item.createdat).format('MM/DD/YYYY hh:mm:ssa') + ')</small>';
		return drcHTML;
	};
};

var get_taxonomy_html = function (options) {
	var path_to_content = options.path_to_content || 'content',
		returnHTML = '',
		display_tax_model_name = (options.tax_model_name === 'user') ? 'author' : options.tax_model_name;
	if (options.generictaxomony && options.generictaxomony.length > 0) {
		if (options.tax_model_name === 'attribute' || options.tax_model_name === 'parent') {
			returnHTML += display_tax_model_name + ': ';
		}
		else {
			returnHTML += pluralize.plural(display_tax_model_name) + ': ';
		}
		options.generictaxomony.forEach(function (generictax, i) {
			var displaylink = generictax.title || generictax.name || generictax.username;
			if (options.tax_model_name === 'attribute' || options.tax_model_name === 'parent') {
				returnHTML += '<small class="ts-text-divider-text-color" >' + displaylink + '</small> ';
			}
			else {
				returnHTML += '<a class="async-admin-ajax-link" href="/' + options.adminPath + '/'+path_to_content+'/' + options.tax_model_name + '/' + generictax._id + '/edit">' + displaylink + '</a> ';
			}
			if (i !== (options.generictaxomony.length - 1)) {
				returnHTML += ' , ';
			}
		});
	}
	return returnHTML;
};

var get_assets_html = function (options) {
	var returnHTML = '';
	if (options.genericassets && options.genericassets.length > 0) {
		returnHTML += '<div>';
		options.genericassets.forEach(function (genericasset) {
			returnHTML += '<span class="ts-padding-md">';
			// returnHTML+='<figure>';
			// audio55
			// music232
			// code41
			// compressed1
			// image79
			// lock72 - keyhole lock74
			// text140
			// video170
			// word6 - ms word
			// x16 - excel
			// zipped2 - zip
			if(genericasset.attributes && genericasset.attributes.encrypted_client_side){
				returnHTML += '<span class="ts-button flaticon-file82 ts-text-xx"></span>';
			}
			else if (genericasset.assettype && genericasset.assettype.match('image')) {
				returnHTML += '<img style="max-width:4em; max-height:4em;" src="' + genericasset.fileurl + '"/>';
			}
			else {
				returnHTML += '<span class="ts-button flaticon-file87 ts-text-xx"></span>';
			}
			//delete - recycle70
			//edit - write19
			// returnHTML+='<caption>'+ genericasset.title +'</caption>';
			// returnHTML+='</figure>';
		});
			returnHTML += '</div>';
	}
	return returnHTML;
};

var cms_default_tbody = function (options) {
	var path_to_content = options.path_to_content || 'content',
		jsontableobj = {};

	jsontableobj = {
		tag: 'tr',
		style: 'vertical-align:top;',
		html: function (obj /*,i*/ ) {
			var displayname = obj.title || obj.name || obj._id;
			if(obj.attributes && obj.attributes.encrypted_client_side){
				displayname+=' <i class="flaticon-access1 ts-text-xs ts-button-icon"></i>';
			}
			var jsontablehtml;
			jsontablehtml = '<td>';
			jsontablehtml += '<a href="/' + options.adminPath + '/'+path_to_content+'/' + options.model_name + '/' + obj._id + '/edit"  class="async-admin-ajax-link">' + displayname + '</a>';
			jsontablehtml += '</td>';
			//create date
			jsontablehtml += '<td>' + new Moment(obj.createdat).format('MM/DD/YYYY |  hh:mm:ssa') + '</td>';

			//authors
			options.generictaxomony = obj.authors;
			options.tax_model_name = 'user';
			jsontablehtml += '<td>' + get_taxonomy_html(options);
			//assets
			if (options.model_name === 'asset') {
				jsontablehtml += get_assets_html({
					genericassets: [obj]
				});
			}
			//contenttypes
			options.generictaxomony = obj.contenttypes;
			options.tax_model_name = 'contenttype';
			jsontablehtml += get_taxonomy_html(options);
			//tags
			options.generictaxomony = obj.tags;
			options.tax_model_name = 'tag';
			jsontablehtml += get_taxonomy_html(options);
			//categories
			options.generictaxomony = obj.categories;
			options.tax_model_name = 'category';
			jsontablehtml += get_taxonomy_html(options);
			//attributes
			options.generictaxomony = obj.attributes;
			options.tax_model_name = 'attribute';
			jsontablehtml += get_taxonomy_html(options);
			//parent
			options.generictaxomony = obj.parent;
			options.tax_model_name = 'parent';
			jsontablehtml += get_taxonomy_html(options);
			jsontablehtml += get_assets_html({
				genericassets: obj.assets
			});
			jsontablehtml += '</td>';
			//options
			jsontablehtml += '<td> <a href="/' + options.adminPath + '/'+path_to_content+'/' + options.model_name + '/' + obj._id + '/edit"  class="async-admin-ajax-link">edit</a> | ';
			jsontablehtml += '<a class="ts-icon ts-button-error-color ts-dialog-delete"  data-href="/' + options.adminPath + '/'+path_to_content+'/' + options.model_name + '/' + obj._id + '/delete" data-deleted-redirect-href="/' + options.adminPath + '/'+path_to_content+'/' + pluralize.plural(options.model_name) + '"/>delete</a></td>';
			return jsontablehtml;
		}
	};
	return jsontableobj;
};

exports.cms_default_tbody = cms_default_tbody;
exports.cms_default_responsive_collapse = cms_default_responsive_collapse;
