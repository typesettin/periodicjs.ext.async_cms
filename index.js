'use strict';

var errorie = require('errorie'),
	asyncadminInstalled,
	path = require('path'),
	fs = require('fs-extra'),
	extend = require('utils-merge'),
	CMS_adminExtSettings,
	appenvironment,
	settingJSON,
	// activate_middleware,
	Extensions = require('periodicjs.core.extensions'),
	CoreExtension = new Extensions({
		extensionFilePath: path.resolve(process.cwd(), './content/config/extensions.json')
	}),
	CMS_adminExtSettingsFile = path.resolve(CoreExtension.getconfigdir({
		extname: 'periodicjs.ext.async_cms'
	}), './settings.json'),
	defaultExtSettings = require('./controller/default_config');

/**
 * An authentication extension that uses passport to authenticate user sessions.
 * @{@link https://github.com/typesettin/periodicjs.ext.admin}
 * @author Yaw Joseph Etse
 * @copyright Copyright (c) 2014 Typesettin. All rights reserved.
 * @license MIT
 * @exports periodicjs.ext.admin
 * @requires module:passport
 * @param  {object} periodic variable injection of resources from current periodic instance
 */
module.exports = function (periodic) {
	// periodic = express,app,logger,config,db,mongoose
	// 
	appenvironment = periodic.settings.application.environment;
	settingJSON = fs.readJsonSync(CMS_adminExtSettingsFile);
	CMS_adminExtSettings = (settingJSON[appenvironment]) ? extend(defaultExtSettings, settingJSON[appenvironment]) : defaultExtSettings;
	periodic.app.controller.extension.admin = {
		CMS_adminExtSettings: CMS_adminExtSettings
	};
	periodic.app.controller.extension.admin = {
		cms: require('./controller/cms')(periodic),
		// settings: require('./controller/settings')(periodic)
	};

	for (var x in periodic.settings.extconf.extensions) {
		if (periodic.settings.extconf.extensions[x].name === 'periodicjs.ext.asyncadmin') {
			asyncadminInstalled = true;
		}
	}

	if (asyncadminInstalled !== true) {
		throw new errorie({
			name: 'Extension: async_cms',
			message: 'Your application extension configuriation is missing periodicjs.ext.asyncadmin'
		});
	}

	var contentAdminRouter = periodic.express.Router(),
		itemRouter = periodic.express.Router(),
		tagRouter = periodic.express.Router(),
		tagContentAdminRouter = periodic.express.Router(),
		mediaRouter = periodic.express.Router(),
		mediaContentAdminRouter = periodic.express.Router(),
		contenttypeRouter = periodic.express.Router(),
		contenttypeContentAdminRouter = periodic.express.Router(),
		categoryRouter = periodic.express.Router(),
		categoryContentAdminRouter = periodic.express.Router(),
		collectionRouter = periodic.express.Router(),
		compilationRouter = periodic.express.Router(),
		itemController = periodic.app.controller.native.item,
		// tagController = periodic.app.controller.native.tag,
		// mediaassetController = periodic.app.controller.native.asset,
		// categoryController = periodic.app.controller.native.category,
		// contenttypeController = periodic.app.controller.native.contenttype,
		collectionController = periodic.app.controller.native.collection,
		compilationController = periodic.app.controller.native.compilation,
		authController = periodic.app.controller.extension.login.auth,
		uacController = periodic.app.controller.extension.user_access_control.uac,
		cmsController = periodic.app.controller.extension.admin.cms;

	/**
	 * access control routes
	 */
	contentAdminRouter.all('*', global.CoreCache.disableCache, authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
	itemRouter.post('*', global.CoreCache.disableCache, authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
	collectionRouter.post('*', global.CoreCache.disableCache, authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
	compilationRouter.post('*', global.CoreCache.disableCache, authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
	tagRouter.post('*', global.CoreCache.disableCache, authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
	tagContentAdminRouter.all('*', global.CoreCache.disableCache, authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
	categoryRouter.post('*', global.CoreCache.disableCache, authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
	categoryContentAdminRouter.all('*', global.CoreCache.disableCache, authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
	contenttypeRouter.post('*', global.CoreCache.disableCache, authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
	contenttypeContentAdminRouter.all('*', global.CoreCache.disableCache, authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
	mediaRouter.post('*', global.CoreCache.disableCache, authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);

	/**
	 * admin routes
	 */
	// contentAdminRouter.get('/', cmsController.admin_index);
	// contentAdminRouter.get('/', cmsController.getMarkdownReleases, cmsController.getHomepageStats, cmsController.admin_index);
	contentAdminRouter.get('/items', itemController.loadItemsWithCount, itemController.loadItemsWithDefaultLimit, itemController.loadItems, cmsController.items_index);
	contentAdminRouter.get('/collections', collectionController.loadCollectionsWithCount, collectionController.loadCollectionsWithDefaultLimit, collectionController.loadCollections, cmsController.collections_index);
	contentAdminRouter.get('/compliations', compilationController.loadCompilationsWithCount, compilationController.loadCompilationsWithDefaultLimit, compilationController.loadCompilations, cmsController.compilations_index);
	// contentAdminRouter.get('/contenttypes', contenttypeController.loadContenttypeWithCount, contenttypeController.loadContenttypeWithDefaultLimit, contenttypeController.loadContenttypes, cmsController.contenttypes_index);
	// contentAdminRouter.get('/tags', tagController.loadTagsWithCount, tagController.loadTagsWithDefaultLimit, tagController.loadTags, cmsController.tags_index);
	// contentAdminRouter.get('/categories', categoryController.loadCategoriesWithCount, categoryController.loadCategoriesWithDefaultLimit, categoryController.loadCategories, cmsController.categories_index);
	// contentAdminRouter.get('/assets', mediaassetController.loadAssetWithCount, mediaassetController.loadAssetWithDefaultLimit, mediaassetController.loadAssets, cmsController.assets_index);
	// contentAdminRouter.get('/extensions', cmsController.loadExtensions, cmsController.extensions_index);
	// contentAdminRouter.get('/themes', cmsController.loadThemes, adminSettingsController.load_theme_settings, cmsController.themes_index);
	// contentAdminRouter.get('/users', userController.loadUsersWithCount, userController.loadUsersWithDefaultLimit, uacController.loadUacUsers, cmsController.users_index);
	// contentAdminRouter.get('/mailer', cmsController.mail_index);
	// contentAdminRouter.get('/check_periodic_version', cmsController.check_periodic_version);

	/**
	 * admin/item manager routes
	 */

contentAdminRouter.get('/item/new',itemController.loadItemsWithCount, itemController.loadItemsWithDefaultLimit, itemController.loadItems, cmsController.items_new);

	contentAdminRouter.use('/asset', mediaContentAdminRouter);
	contentAdminRouter.use('/contenttype', contenttypeContentAdminRouter);
	contentAdminRouter.use('/tag', tagContentAdminRouter);
	contentAdminRouter.use('/category', categoryContentAdminRouter);
	periodic.app.use('/' + periodic.app.locals.adminPath + '/content', contentAdminRouter);
	periodic.app.use('/item', itemRouter);
	periodic.app.use('/collection', collectionRouter);
	periodic.app.use('/compilation', compilationRouter);
	periodic.app.use('/tag', tagRouter);
	periodic.app.use('/category', categoryRouter);
	periodic.app.use('/contenttype', contenttypeRouter);
	periodic.app.use('/mediaasset', mediaRouter);
	return periodic;
};
