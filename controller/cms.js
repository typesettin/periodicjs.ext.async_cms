'use strict';

var moment = require('moment'),
	CoreUtilities,
	CoreController,
	appSettings,
	mongoose,
	logger,
	merge = require('utils-merge'),
	pluralize = require('pluralize'),
	capitalize = require('capitalize'),
	assetController,
	controllerOptions,
	// configError,
	// Contenttype,
	// Collection,
	// Compilation,
	// Item,
	// User,
	async_cms_settings,
	adminPath;
pluralize.addIrregularRule('category', 'categories');

var remove_content_and_changes = function (req, res, next) {
	req.controllerData = req.controllerData || {};
	req.controllerData.model_fields = {
		'primaryasset.changes':0,
		'primaryasset.content':0,
		'assets.changes':0,
		'assets.content':0,
		'primaryauthor.changes':0,
		'primaryauthor.content':0,
		'authors.changes':0,
		'authors.content':0,
		changes:0,
		content:0
	}; 
	next();
};
var fixCodeMirrorSubmit = function (req, res, next) {
	// console.log('fixCodeMirrorSubmit req.body',req.body)
	if(req.body.genericdocjson){

		req.controllerData = req.controllerData || {};
		// req.controllerData.encryptFields = true;
		var jsonbody = JSON.parse(req.body.genericdocjson);
		delete req.body.genericdocjson;
		req.body = merge(req.body, jsonbody);
		if(!req.body.docid){
			req.body.docid = req.body._id;
		}
		delete req.body._id;
		delete req.body.__v;
	}
	next();
};

var get_entity_modifications = function (entityname) {
	var entity = entityname.toLowerCase(),
		plural_entity = pluralize.plural(entity);
	return {
		name: entity, //item
		plural_name: pluralize.plural(entity), //items
		capitalized_name: capitalize(entity), //Item
		capitalized_plural_name: capitalize(plural_entity) //Items
	};
};

var get_entity_search = function(options){
	var entityname = options.entity;

	return function(options,callback){
		CoreController.controller_model_search_query({
			req: options.req,
			res: options.res,
			orQuery: [],
			controllerOptions: controllerOptions[entityname],
			asyncCallback: callback
		});
	};
};

var get_revision_page = function(options){
	var entity = get_entity_modifications(options.entity);

	return function (req, res) {
		var viewtemplate = {
				viewname: 'p-admin/' + entity.plural_name + '/revisions',
				themefileext: appSettings.templatefileextension,
				extname: 'periodicjs.ext.async_cms'
			},

			viewdata = merge(req.controllerData, {
				pagedata: {
					title: entity.capitalized_name + ' Revisions',
					toplink: '&raquo;   <a href="/' + adminPath + '/content/' + entity.plural_name + '" class="async-admin-ajax-link">' + entity.capitalized_plural_name + '</a> &raquo; ' + req.controllerData[entity.name].title+' &raquo; Revisions',
					extensions: CoreUtilities.getAdminMenu()
				},
				user: req.user
			});
		CoreController.renderView(req, res, viewtemplate, viewdata);
	};
};

var get_index_page = function (options) {
	var entity = get_entity_modifications(options.entity);

	return function (req, res) {
		var viewtemplate = {
				viewname: 'p-admin/' + entity.plural_name + '/index',
				themefileext: appSettings.templatefileextension,
				extname: 'periodicjs.ext.async_cms'
			},

			viewdata = merge(req.controllerData, {
				pagedata: {
					title: entity.capitalized_name + ' Admin',
					toplink: '&raquo;   <a href="/' + adminPath + '/content/' + entity.plural_name + '" class="async-admin-ajax-link">' + entity.capitalized_plural_name + '</a>',
					extensions: CoreUtilities.getAdminMenu()
				},
				user: req.user
			});
		CoreController.renderView(req, res, viewtemplate, viewdata);
	};
};

var get_new_page = function (options) {
	var entity = get_entity_modifications(options.entity);

	return function (req, res) {
		req.controllerData[entity.name] = null;
		var viewtemplate = {
				viewname: 'p-admin/' + entity.plural_name + '/new',
				themefileext: appSettings.templatefileextension,
				extname: 'periodicjs.ext.async_cms'
			},
			viewdata = merge(req.controllerData, {
				pagedata: {
					title: 'New ' + entity.capitalized_name,
					toplink: '&raquo;   <a href="/' + adminPath + '/content/' + entity.plural_name + '" class="async-admin-ajax-link">' + entity.capitalized_plural_name + '</a> &raquo; New',
					extensions: CoreUtilities.getAdminMenu()
				},
				default_contentypes: { /*defaultcontenttypes*/ },
				serverdate: moment().format('YYYY-MM-DD'),
				servertime: moment().format('HH:mm'),
				adminSettings: async_cms_settings,
				user: req.user
			});
		CoreController.renderView(req, res, viewtemplate, viewdata);
	};
};

var get_edit_page = function (options) {
	var entity = get_entity_modifications(options.entity);

	return function (req, res) {
		var viewtemplate = {
				viewname: adminPath + '/' + entity.plural_name + '/edit',
				themefileext: appSettings.templatefileextension,
				extname: 'periodicjs.ext.async_cms'
			},
			viewdata = merge(req.controllerData, {
				pagedata: {
					title: req.controllerData[entity.name].title + ' - Edit ' + entity.capitalized_name,
					toplink: '&raquo;   <a href="/' + adminPath + '/content/' + entity.plural_name + '" class="async-admin-ajax-link">' + entity.capitalized_name + '</a> &raquo; ' + req.controllerData[entity.name].title,
					extensions: CoreUtilities.getAdminMenu()
				},
				default_contentypes: { /*defaultcontenttypes*/ },
				serverdate: moment().format('YYYY-MM-DD'),
				servertime: moment().format('HH:mm'),
				adminSettings: async_cms_settings,
				user: req.user
			});
		if(req.controllerData[entity.name].publishat){
			viewdata.serverdate = moment(req.controllerData[entity.name].publishat).format('YYYY-MM-DD');
			viewdata.servertime = moment(req.controllerData[entity.name].publishat).format('HH:mm');
		}
		CoreController.renderView(req, res, viewtemplate, viewdata);
	};
};

var tag_parent = function (req, res) {
	var viewtemplate = {
			viewname: 'p-admin/tags/show_parent',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.async_cms'
		},
		viewdata = {
			pagedata: {
				title: req.controllerData.tag.title + ' - Edit Category',
				toplink: '&raquo; <a href="/' + adminPath + '/content/tags" class="async-admin-ajax-link">Tags</a>',
				extensions: CoreUtilities.getAdminMenu()
			},
			parent: req.controllerData.tag.parent,
			user: req.user
		};
	CoreController.renderView(req, res, viewtemplate, viewdata);
};

var category_parent = function (req, res) {
	var viewtemplate = {
			viewname: 'p-admin/categories/show_parent',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.async_cms'
		},
		viewdata = {
			pagedata: {
				title: req.controllerData.category.title + ' - Edit Category',
				toplink: '&raquo; <a href="/' + adminPath + '/content/categories" class="async-admin-ajax-link">Categories</a>',
				extensions: CoreUtilities.getAdminMenu()
			},
			parent: req.controllerData.category.parent,
			user: req.user
		};
	CoreController.renderView(req, res, viewtemplate, viewdata);
};

var update_asset_from_file = function (req, res, next) {
	try {
		// console.log('req.body', req.body);
		if(req.controllerData && req.controllerData.files && req.controllerData.files[0]){
		// console.log('req.controllerData.files[0]', req.controllerData.files[0]);

			var assetFromFile = req.controllerData.files[0],
				updatedAssetObj,
				originalbodydoc;
			if (assetFromFile) {
				updatedAssetObj = assetController.get_asset_object_from_file({
					file: assetFromFile,
					req: req
				});
				originalbodydoc = req.controllerData.asset._doc || req.controllerData.asset;
				delete updatedAssetObj.changes;
				req.skipemptyvaluecheck = true;
				req.body = merge(originalbodydoc, updatedAssetObj);
				req.body.docid = req.controllerData.asset._id;
				delete req.body._id;
			}
		}
		req.redirectpath = '/p-admin/content/asset/';
		next();
	}
	catch (e) {
		next(e);
	}
};

/**
 * admin controller
 * @module authController
 * @{@link https://github.com/typesettin/periodic}
 * @author Yaw Joseph Etse
 * @copyright Copyright (c) 2014 Typesettin. All rights reserved.
 * @license MIT
 * @requires module:periodicjs.core.utilities
 * @requires module:periodicjs.core.controller
 * @requires module:periodicjs.core.extensions
 * @param  {object} resources variable injection from current periodic instance with references to the active logger and mongo session
 * @return {object}          
 */
var controller = function (resources) {
	logger = resources.logger;
	mongoose = resources.mongoose;
	appSettings = resources.settings;
	CoreController = resources.core.controller;
	CoreUtilities = resources.core.utilities;
	// AppDBSetting = mongoose.model('Setting');
	// var appenvironment = appSettings.application.environment;
	assetController = resources.app.controller.native.asset;
	async_cms_settings = resources.app.controller.extension.async_cms.async_cms_settings;
	adminPath = resources.app.locals.adminPath;
	controllerOptions = resources.app.controller.native.ControllerSettings;

	return {
		datas_index: get_index_page({
			entity: 'data'
		}),
		data_revisions: get_revision_page({
			entity: 'data'
		}),
		data_new: get_new_page({
			entity: 'data'
		}),
		data_edit: get_edit_page({
			entity: 'data'
		}),
		items_index: get_index_page({
			entity: 'item'
		}),
		item_revisions: get_revision_page({
			entity: 'item'
		}),
		item_new: get_new_page({
			entity: 'item'
		}),
		item_edit: get_edit_page({
			entity: 'item'
		}),
		collections_index: get_index_page({
			entity: 'collection'
		}),
		collection_revisions: get_revision_page({
			entity: 'collection'
		}),
		collection_new: get_new_page({
			entity: 'collection'
		}),
		collection_edit: get_edit_page({
			entity: 'collection'
		}),
		compilations_index: get_index_page({
			entity: 'compilation'
		}),
		compilation_revisions: get_revision_page({
			entity: 'compilation'
		}),
		compilation_new: get_new_page({
			entity: 'compilation'
		}),
		compilation_edit: get_edit_page({
			entity: 'compilation'
		}),
		assets_index: get_index_page({
			entity: 'asset'
		}),
		asset_revisions: get_revision_page({
			entity: 'asset'
		}),
		asset_new: get_new_page({entity:'asset'}),
		asset_edit: get_edit_page({
			entity: 'asset'
		}),
		contenttypes_index: get_index_page({
			entity: 'contenttype'
		}),
		contenttype_revisions: get_revision_page({
			entity: 'contenttype'
		}),
		// contenttype_new: get_new_page({entity:'contenttype'}),
		contenttype_edit: get_edit_page({
			entity: 'contenttype'
		}),
		tags_index: get_index_page({
			entity: 'tag'
		}),
		tag_revisions: get_revision_page({
			entity: 'tag'
		}),
		tag_edit: get_edit_page({
			entity: 'tag'
		}),
		tag_parent: tag_parent,
		categories_index: get_index_page({
			entity: 'category'
		}),
		category_revisions: get_revision_page({
			entity: 'category'
		}),
		category_edit: get_edit_page({
			entity: 'category'
		}),
		item_search: get_entity_search({entity: 'item'}),
		data_search: get_entity_search({entity: 'data'}),
		collection_search: get_entity_search({entity: 'collection'}),
		compilation_search: get_entity_search({entity: 'compilation'}),
		contenttype_search: get_entity_search({entity: 'contenttype'}),
		tag_search: get_entity_search({entity: 'tag'}),
		category_search: get_entity_search({entity: 'category'}),
		asset_search: get_entity_search({entity: 'asset'}),
		fixCodeMirrorSubmit:fixCodeMirrorSubmit,
		category_parent: category_parent,
		async_cms_settings: async_cms_settings,
		update_asset_from_file: update_asset_from_file,
		remove_content_and_changes: remove_content_and_changes
	};
};

module.exports = controller;
