'use strict';

var moment = require('moment'),
	CoreUtilities,
	CoreController,
	appSettings,
	mongoose,
	logger,
	merge = require('utils-merge'),
	assetController,
	// configError,
	// Contenttype,
	// Collection,
	// Compilation,
	// Item,
	// User,
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
	// req.flash('info', 'testing flash now');
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

var collection_new = function (req, res) {
	var viewtemplate = {
			viewname: 'p-admin/collections/new',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.async_cms'
		},
		viewdata = {
			pagedata: {
				title: 'New Collection ',
				toplink: '&raquo; <a href="/' + adminPath + '/content/collections" class="async-admin-ajax-link">Collections</a> &raquo; New',
				extensions: CoreUtilities.getAdminMenu()
			},
			collection: null,
			default_contentypes: { /*defaultcontenttypes*/ },
			serverdate: moment().format('YYYY-MM-DD'),
			servertime: moment().format('HH:mm'),
			adminSettings: async_cms_settings,
			user: req.user
		};
	CoreController.renderView(req, res, viewtemplate, viewdata);
};

var collection_edit = function (req, res) {
	var viewtemplate = {
			viewname: 'p-admin/collections/edit',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.async_cms'
		},
		viewdata = {
			pagedata: {
				title: req.controllerData.collection.title + ' - Edit Collection',
				toplink: '&raquo; <a href="/' + adminPath + '/content/collections" class="async-admin-ajax-link">Collections</a>',
				extensions: CoreUtilities.getAdminMenu()
			},
			collection: req.controllerData.collection,
			serverdate: moment(req.controllerData.collection.publishat).format('YYYY-MM-DD'),
			servertime: moment(req.controllerData.collection.publishat).format('HH:mm'),
			adminSettings: async_cms_settings,
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

var compilation_new = function (req, res) {
	var viewtemplate = {
			viewname: 'p-admin/compilations/new',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.async_cms'
		},
		viewdata = {
			pagedata: {
				title: 'New Compilation ',
				toplink: '&raquo; <a href="/' + adminPath + '/content/compilations" class="async-admin-ajax-link">Compilations</a> &raquo; New',
				extensions: CoreUtilities.getAdminMenu()
			},
			compilation: null,
			default_contentypes: { /*defaultcontenttypes*/ },
			serverdate: moment().format('YYYY-MM-DD'),
			servertime: moment().format('HH:mm'),
			adminSettings: async_cms_settings,
			user: req.user
		};
	CoreController.renderView(req, res, viewtemplate, viewdata);
};

var compilation_edit = function (req, res) {
	var viewtemplate = {
			viewname: 'p-admin/compilations/edit',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.async_cms'
		},
		viewdata = {
			pagedata: {
				title: req.controllerData.compilation.title + ' - Edit Compilation',
				toplink: '&raquo; <a href="/' + adminPath + '/content/compilations" class="async-admin-ajax-link">Compilations</a>',
				extensions: CoreUtilities.getAdminMenu()
			},
			compilation: req.controllerData.compilation,
			serverdate: moment(req.controllerData.compilation.publishat).format('YYYY-MM-DD'),
			servertime: moment(req.controllerData.compilation.publishat).format('HH:mm'),
			adminSettings: async_cms_settings,
			user: req.user
		};
	CoreController.renderView(req, res, viewtemplate, viewdata);
};

var assets_index = function (req, res) {
	var viewtemplate = {
			viewname: 'p-admin/assets/index',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.async_cms'
		},
		viewdata = {
			pagedata: {
				title: 'Asset Admin',
				toplink: '&raquo; Assets',
				extensions: CoreUtilities.getAdminMenu()
			},
			assets: req.controllerData.assets,
			assetscount: req.controllerData.assetscount,
			assetpages: Math.ceil(req.controllerData.assetscount / req.query.limit),
			user: req.user
		};
	CoreController.renderView(req, res, viewtemplate, viewdata);
};

var asset_edit = function (req, res) {
	var viewtemplate = {
			viewname: 'p-admin/assets/edit',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.async_cms'
		},
		viewdata = {
			pagedata: {
				title: req.controllerData.asset.title + ' - Edit Asset',
				toplink: '&raquo; <a href="/' + adminPath + '/content/assets" class="async-admin-ajax-link">Assets</a>',
				extensions: CoreUtilities.getAdminMenu()
			},
			asset: req.controllerData.asset,
			serverdate: moment(req.controllerData.asset.publishat).format('YYYY-MM-DD'),
			servertime: moment(req.controllerData.asset.publishat).format('HH:mm'),
			adminSettings: async_cms_settings,
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

var contenttype_edit = function (req, res) {
	var viewtemplate = {
			viewname: 'p-admin/contenttypes/show',
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

var tags_index = function (req, res) {
	var viewtemplate = {
			viewname: 'p-admin/tags/index',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.async_cms'
		},
		viewdata = {
			pagedata: {
				title: 'Tag Admin',
				toplink: '&raquo; Tags',
				extensions: CoreUtilities.getAdminMenu()
			},
			tags: req.controllerData.tags,
			tagscount: req.controllerData.tagscount,
			tagpages: Math.ceil(req.controllerData.tagscount / req.query.limit),
			user: req.user
		};
	CoreController.renderView(req, res, viewtemplate, viewdata);
};

var tag_edit = function (req, res) {
	var viewtemplate = {
			viewname: 'p-admin/tags/edit',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.async_cms'
		},
		viewdata = {
			pagedata: {
				title: req.controllerData.tag.title + ' - Edit Tag',
				toplink: '&raquo; <a href="/' + adminPath + '/content/tags" class="async-admin-ajax-link">Tags</a>',
				extensions: CoreUtilities.getAdminMenu()
			},
			tag: req.controllerData.tag,
			serverdate: moment(req.controllerData.tag.publishat).format('YYYY-MM-DD'),
			servertime: moment(req.controllerData.tag.publishat).format('HH:mm'),
			adminSettings: async_cms_settings,
			user: req.user
		};
	CoreController.renderView(req, res, viewtemplate, viewdata);
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

var categories_index = function (req, res) {
	var viewtemplate = {
			viewname: 'p-admin/categories/index',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.async_cms'
		},
		viewdata = {
			pagedata: {
				title: 'Category Admin',
				toplink: '&raquo; Categories',
				extensions: CoreUtilities.getAdminMenu()
			},
			categories: req.controllerData.categories,
			categoriescount: req.controllerData.categoriescount,
			categorypages: Math.ceil(req.controllerData.categoriescount / req.query.limit),
			user: req.user
		};
	CoreController.renderView(req, res, viewtemplate, viewdata);
};

var category_edit = function (req, res) {
	var viewtemplate = {
			viewname: 'p-admin/categories/edit',
			themefileext: appSettings.templatefileextension,
			extname: 'periodicjs.ext.async_cms'
		},
		viewdata = {
			pagedata: {
				title: req.controllerData.category.title + ' - Edit Category',
				toplink: '&raquo; <a href="/' + adminPath + '/content/categories" class="async-admin-ajax-link">Categories</a>',
				extensions: CoreUtilities.getAdminMenu()
			},
			category: req.controllerData.category,
			serverdate: moment(req.controllerData.category.publishat).format('YYYY-MM-DD'),
			servertime: moment(req.controllerData.category.publishat).format('HH:mm'),
			adminSettings: async_cms_settings,
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

var update_asset_from_file = function(req,res,next){
	try{
		console.log('req.controllerData.files[0]',req.controllerData.files[0]);
		console.log('req.body',req.body);
		var assetFromFile = req.controllerData.files[0],
		updatedAssetObj,
		originalbodydoc;
		if(assetFromFile){
			updatedAssetObj = assetController.get_asset_object_from_file({file:assetFromFile,req:req});
			originalbodydoc = req.controllerData.asset._doc || req.controllerData.asset;
			delete updatedAssetObj.changes;
			req.skipemptyvaluecheck = true;
			req.body = 	merge(originalbodydoc,updatedAssetObj);
			req.body.docid = req.controllerData.asset._id;
			delete req.body._id;
		}
		next();
	}
	catch(e){
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
	// Collection = mongoose.model('Collection');
	// Compilation = mongoose.model('Compilation');
	// Contenttype = mongoose.model('Contenttype');
	// Item = mongoose.model('Item');
	// User = mongoose.model('User');
	// AppDBSetting = mongoose.model('Setting');
	// var appenvironment = appSettings.application.environment;
	assetController = resources.app.controller.native.asset;
	async_cms_settings = resources.app.controller.extension.async_cms.async_cms_settings;
	adminPath = resources.app.locals.adminPath;

	return {
		items_index: items_index,
		item_new: item_new,
		item_edit: item_edit,
		collections_index: collections_index,
		collection_new: collection_new,
		collection_edit: collection_edit,
		compilations_index: compilations_index,
		compilation_new: compilation_new,
		compilation_edit: compilation_edit,
		assets_index: assets_index,
		asset_edit: asset_edit,
		// asset_new: asset_new,
		contenttypes_index: contenttypes_index,
		contenttype_edit: contenttype_edit,
		// contenttype_new: contenttype_new,
		tags_index: tags_index,
		tag_edit: tag_edit,
		tag_parent: tag_parent,
		categories_index: categories_index,
		category_edit: category_edit,
		category_parent: category_parent,
		async_cms_settings: async_cms_settings,
		update_asset_from_file: update_asset_from_file
	};
};

module.exports = controller;
