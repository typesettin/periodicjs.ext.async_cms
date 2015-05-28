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
	periodic.app.locals.cms_item_route = CMS_adminExtSettings.content_routes.item;
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
		itemContentAdminRouter = periodic.express.Router(),
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
		tagController = periodic.app.controller.native.tag,
		assetController = periodic.app.controller.native.asset,
		categoryController = periodic.app.controller.native.category,
		contenttypeController = periodic.app.controller.native.contenttype,
		userController = periodic.app.controller.native.user,
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
	// contentAdminRouter.get('/assets', assetController.loadAssetWithCount, assetController.loadAssetWithDefaultLimit, assetController.loadAssets, cmsController.assets_index);
	// contentAdminRouter.get('/extensions', cmsController.loadExtensions, cmsController.extensions_index);
	// contentAdminRouter.get('/themes', cmsController.loadThemes, adminSettingsController.load_theme_settings, cmsController.themes_index);
	// contentAdminRouter.get('/users', userController.loadUsersWithCount, userController.loadUsersWithDefaultLimit, uacController.loadUacUsers, cmsController.users_index);
	// contentAdminRouter.get('/mailer', cmsController.mail_index);
	// contentAdminRouter.get('/check_periodic_version', cmsController.check_periodic_version);

	/**
	 * admin/item manager routes
	 */

	itemContentAdminRouter.get('/new', cmsController.item_new);
	itemContentAdminRouter.get('/:id/edit', itemController.loadFullItem, cmsController.item_edit);
	itemContentAdminRouter.get('/:id', itemController.loadFullItem, cmsController.item_edit);
	// adminRouter.get('/items/search', itemController.loadItems, adminController.items_index);
	// adminRouter.get('/item/edit/:id/revision/:changeset', itemController.loadFullItem, adminController.item_review_revision);
	// adminRouter.get('/item/edit/:id/revisions', itemController.loadFullItem, adminController.item_revisions);
	// adminRouter.get('/item/search', adminController.setSearchLimitTo1000, itemController.loadItems, itemController.index);
	itemContentAdminRouter.post('/new',
		assetController.multiupload,
		assetController.create_assets_from_files,
		periodic.core.controller.save_revision,
		itemController.create);
	itemContentAdminRouter.post('/:id/edit',
		assetController.multiupload,
		assetController.create_assets_from_files,
		periodic.core.controller.save_revision, itemController.loadItem, itemController.update);
	// itemRouter.post('/removechangeset/:id/:contententity/:changesetnum', itemController.loadItem, adminController.remove_changeset_from_content, itemController.update);
	itemContentAdminRouter.post('/:id/delete', itemController.loadItem, itemController.remove);


	/**
	 * admin/collection manager routes
	 */
	// contentAdminRouter.get('/collections/new',collectionController.loadItemsWithCount, collectionController.loadItemsWithDefaultLimit, collectionController.loadItems, cmsController.collections_new);




	/**
	 * admin/tag manager routes
	 */
	tagContentAdminRouter.post('/new/:id', tagController.loadTag, tagController.create);
	tagContentAdminRouter.post('/new', tagController.loadTag, tagController.create);
	// tagRouter.post('/:id/delete', tagController.loadTag, tagController.remove);
	// tagRouter.post('/edit', tagController.update);
	// tagAdminRouter.get('/edit/:id', tagController.loadTag, adminController.tag_show);
	// tagAdminRouter.get('/:id', tagController.loadTag, adminController.tag_show);
	// tagAdminRouter.get('/:id/parent', tagController.loadTag, adminController.tag_parent);


	/**
	 * admin/category manager routes
	 */
	categoryContentAdminRouter.post('/new/:id', categoryController.loadCategory, categoryController.create);
	categoryContentAdminRouter.post('/new', categoryController.loadCategory, categoryController.create);
	// categoryRouter.post('/:id/delete', categoryController.loadCategory, categoryController.remove);
	// categoryRouter.post('/edit', categoryController.update);
	// categoryAdminRouter.get('/edit/:id', categoryController.loadCategory, adminController.category_show);
	// categoryAdminRouter.get('/:id', categoryController.loadCategory, adminController.category_show);
	// categoryAdminRouter.get('/:id/parent', categoryController.loadCategory, adminController.category_parent);

	/**
	 * admin/categorytype manager routes
	 */
	contenttypeContentAdminRouter.post('/new/:id', contenttypeController.loadContenttype, contenttypeController.create);
	contenttypeContentAdminRouter.post('/new', contenttypeController.loadContenttype, contenttypeController.create);
	// contenttypeRouter.post('/:id/delete', contenttypeController.loadContenttype, contenttypeController.remove);
	// contenttypeRouter.post('/append/:id', contenttypeController.loadContenttype, contenttypeController.append);
	// contenttypeRouter.post('/removeitem/:id', contenttypeController.loadContenttype, contenttypeController.removeitem);
	// contenttypeAdminRouter.get('/edit/:id', contenttypeController.loadContenttype, adminController.contenttype_show);
	// contenttypeAdminRouter.get('/:id', contenttypeController.loadContenttype, adminController.contenttype_show);


	/**
	 * periodic routes
	 */
	contentAdminRouter.get('/user/search.:ext', global.CoreCache.disableCache, userController.loadUsers, userController.searchResults);
	contentAdminRouter.get('/user/search', global.CoreCache.disableCache, userController.loadUsers, userController.searchResults);
	contentAdminRouter.post('/user/search/:id', global.CoreCache.disableCache, userController.loadUser, userController.show);
	contentAdminRouter.get('/category/search.:ext', global.CoreCache.disableCache, categoryController.loadCategories, categoryController.searchResults);
	contentAdminRouter.get('/category/search', global.CoreCache.disableCache, categoryController.loadCategories, categoryController.searchResults);
	contentAdminRouter.get('/category/:id/children', global.CoreCache.disableCache, categoryController.loadCategory, categoryController.loadChildren, categoryController.showChildren);
	contentAdminRouter.get('/contenttype/search.:ext', global.CoreCache.disableCache, contenttypeController.loadContenttypes, contenttypeController.searchResults);
	contentAdminRouter.get('/contenttype/search', global.CoreCache.disableCache, contenttypeController.loadContenttypes, contenttypeController.searchResults);
	contentAdminRouter.get('/tag/search.:ext', global.CoreCache.disableCache, tagController.loadTags, tagController.searchResults);
	contentAdminRouter.get('/tag/search', global.CoreCache.disableCache, tagController.loadTags, tagController.searchResults);
	contentAdminRouter.get('/tag/:id/children', global.CoreCache.disableCache, tagController.loadTag, tagController.loadChildren, tagController.showChildren);

	//link routers

	contentAdminRouter.use('/item', itemContentAdminRouter);
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
