'use strict';

var moment = require('moment'),
	CoreUtilities,
	CoreController,
	appSettings,
	mongoose,
	logger,
	// configError,
	Contenttype,
	Collection,
	Compilation,
	Item,
	User,
	async_cms_settings,
	adminPath;


var items_index = function (req, res) {
	var viewtemplate = {
			viewname: 'p-admin/items/index',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.async_cms'
		},
		viewdata = {
			pagedata: {
				title: 'Item Admin',
				toplink: '&raquo;   <a href="/' + adminPath + '/content/items" class="async-admin-ajax-link">Items</a>',
				extensions: CoreUtilities.getAdminMenu()
			},
			items: req.controllerData.items,
			itemscount: req.controllerData.itemscount,
			itempages: Math.ceil(req.controllerData.itemscount / req.query.limit),
			user: req.user
		};
	CoreController.renderView(req, res, viewtemplate, viewdata);
};

var item_new = function (req, res) {
	var viewtemplate = {
			viewname: 'p-admin/items/new',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.async_cms'
		},
		viewdata = {
			pagedata: {
				title: 'New Item ',
				toplink: '&raquo; <a href="/' + adminPath + '/content/items" class="async-admin-ajax-link">Items</a> &raquo; New',
				extensions: CoreUtilities.getAdminMenu()
			},
			item: null,
			default_contentypes: { /*defaultcontenttypes*/ },
			serverdate: moment().format('YYYY-MM-DD'),
			servertime: moment().format('HH:mm'),
			adminSettings: async_cms_settings,
			user: req.user
		};
	CoreController.renderView(req, res, viewtemplate, viewdata);
};

var item_edit = function (req, res) {
	var viewtemplate = {
			viewname: 'p-admin/items/edit',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.async_cms'
		},
		viewdata = {
			pagedata: {
				title: req.controllerData.item.title + ' - Edit Item',
				toplink: '&raquo; <a href="/' + adminPath + '/content/items" class="async-admin-ajax-link">Items</a>',
				extensions: CoreUtilities.getAdminMenu()
			},
			item: req.controllerData.item,
			serverdate: moment(req.controllerData.item.publishat).format('YYYY-MM-DD'),
			servertime: moment(req.controllerData.item.publishat).format('HH:mm'),
			adminSettings: async_cms_settings,
			user: req.user
		};
	CoreController.renderView(req, res, viewtemplate, viewdata);
};

var collections_index = function (req, res) {
	req.flash('info', 'testing flash now');
	var viewtemplate = {
			viewname: 'p-admin/collections/index',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.async_cms'
		},
		viewdata = {
			pagedata: {
				title: 'Collection Admin',
				toplink: '&raquo; Collections',
				extensions: CoreUtilities.getAdminMenu()
			},
			collections: req.controllerData.collections,
			collectionscount: req.controllerData.collectionscount,
			collectionpages: Math.ceil(req.controllerData.collectionscount / req.query.limit),
			user: req.user
		};
	CoreController.renderView(req, res, viewtemplate, viewdata);
};

var compilations_index = function (req, res) {
	var viewtemplate = {
			viewname: 'p-admin/compilations/index',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.async_cms'
		},
		viewdata = {
			pagedata: {
				title: 'Compilation Admin',
				toplink: '&raquo; Compilations',
				extensions: CoreUtilities.getAdminMenu()
			},
			compilations: req.controllerData.compilations,
			compilationscount: req.controllerData.compilationscount,
			compilationpages: Math.ceil(req.controllerData.compilationscount / req.query.limit),
			user: req.user
		};
	CoreController.renderView(req, res, viewtemplate, viewdata);
};

var contenttypes_index = function (req, res) {
	var viewtemplate = {
			viewname: 'p-admin/contenttypes/index',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.async_cms'
		},
		viewdata = {
			pagedata: {
				title: 'Content Type Admin',
				toplink: '&raquo;   <a href="/' + adminPath + '/content/contenttypes" class="async-admin-ajax-link">Content Types</a>',
				extensions: CoreUtilities.getAdminMenu()
			},
			contenttypes: req.controllerData.contenttypes,
			contenttypescount: req.controllerData.contenttypescount,
			contenttypepages: Math.ceil(req.controllerData.contenttypescount / req.query.limit),
			user: req.user
		};
	CoreController.renderView(req, res, viewtemplate, viewdata);
};

var contenttype_new = function (req, res) {
	var viewtemplate = {
			viewname: 'p-admin/contenttypes/new',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.async_cms'
		},
		viewdata = {
			pagedata: {
				title: 'New Content Type ',
				toplink: '&raquo; <a href="/' + adminPath + '/content/contenttypes" class="async-admin-ajax-link">Items</a> &raquo; New Content Type',
				extensions: CoreUtilities.getAdminMenu()
			},
			contenttype: null,
			default_contentypes: { /*defaultcontenttypes*/ },
			serverdate: moment().format('YYYY-MM-DD'),
			servertime: moment().format('HH:mm'),
			adminSettings: async_cms_settings,
			user: req.user
		};
	CoreController.renderView(req, res, viewtemplate, viewdata);
};

var contenttype_edit = function (req, res) {
	var viewtemplate = {
			viewname: 'p-admin/contenttypes/edit',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.async_cms'
		},
		viewdata = {
			pagedata: {
				title: req.controllerData.contenttype.title + ' - Edit Content Type',
				toplink: '&raquo; <a href="/' + adminPath + '/content/contenttypes" class="async-admin-ajax-link">Content Types</a>',
				extensions: CoreUtilities.getAdminMenu()
			},
			contenttype: req.controllerData.contenttype,
			serverdate: moment(req.controllerData.contenttype.publishat).format('YYYY-MM-DD'),
			servertime: moment(req.controllerData.contenttype.publishat).format('HH:mm'),
			adminSettings: async_cms_settings,
			user: req.user
		};
	CoreController.renderView(req, res, viewtemplate, viewdata);
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
	Collection = mongoose.model('Collection');
	Compilation = mongoose.model('Compilation');
	Contenttype = mongoose.model('Contenttype');
	Item = mongoose.model('Item');
	User = mongoose.model('User');
	// AppDBSetting = mongoose.model('Setting');
	// var appenvironment = appSettings.application.environment;
	async_cms_settings = resources.app.controller.extension.async_cms.async_cms_settings;
	adminPath = resources.app.locals.adminPath;

	return {
		items_index: items_index,
		item_new: item_new,
		item_edit: item_edit,
		collections_index: collections_index,
		compilations_index: compilations_index,
		contenttypes_index: contenttypes_index,
		contenttype_edit: contenttype_edit,
		contenttype_new: contenttype_new,
		async_cms_settings: async_cms_settings,
	};
};

module.exports = controller;
