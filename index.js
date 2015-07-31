'use strict';

var errorie = require('errorie'),
	asyncadminInstalled,
	path = require('path'),
	fs = require('fs-extra'),
	extend = require('utils-merge'),
	async_cms_settings,
	appenvironment,
	settingJSON,
	// activate_middleware,
	async_cms_settingsFile = path.join(process.cwd(), 'content/config/extensions/periodicjs.ext.async_cms/settings.json'),
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
	settingJSON = fs.readJsonSync(async_cms_settingsFile);
	async_cms_settings = (settingJSON[appenvironment]) ? extend(defaultExtSettings, settingJSON[appenvironment]) : defaultExtSettings;
	periodic.app.controller.extension.async_cms = {
		async_cms_settings: async_cms_settings
	};
	if (async_cms_settings.content_routes) {
		if (async_cms_settings.content_routes.item) {
			periodic.app.locals.cms_item_route = async_cms_settings.content_routes.item;
		}
	}
	periodic.app.controller.extension.async_cms = {
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
		assetRouter = periodic.express.Router(),
		assetContentAdminRouter = periodic.express.Router(),
		contenttypeRouter = periodic.express.Router(),
		contenttypeContentAdminRouter = periodic.express.Router(),
		categoryRouter = periodic.express.Router(),
		categoryContentAdminRouter = periodic.express.Router(),
		collectionRouter = periodic.express.Router(),
		collectionContentAdminRouter = periodic.express.Router(),
		compilationRouter = periodic.express.Router(),
		compilationContentAdminRouter = periodic.express.Router(),
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
		cmsController = periodic.app.controller.extension.async_cms.cms;

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
	assetRouter.post('*', global.CoreCache.disableCache, authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);

	/**
	 * admin routes
	 */
	// contentAdminRouter.get('/', cmsController.admin_index);
	// contentAdminRouter.get('/', cmsController.getMarkdownReleases, cmsController.getHomepageStats, cmsController.admin_index);
	contentAdminRouter.use('/items', itemController.loadItemsWithCount, itemController.loadItemsWithDefaultLimit, itemController.loadItems, cmsController.items_index);
	contentAdminRouter.get('/collections', collectionController.loadCollectionsWithCount, collectionController.loadCollectionsWithDefaultLimit, collectionController.loadCollections, cmsController.collections_index);
	contentAdminRouter.get('/compilations', compilationController.loadCompilationsWithCount, compilationController.loadCompilationsWithDefaultLimit, compilationController.loadCompilations, cmsController.compilations_index);
	contentAdminRouter.get('/contenttypes', contenttypeController.loadContenttypesWithCount, contenttypeController.loadContenttypesWithDefaultLimit, contenttypeController.loadContenttypes, cmsController.contenttypes_index);
	contentAdminRouter.get('/tags', tagController.loadTagsWithCount, tagController.loadTagsWithDefaultLimit, tagController.loadTags, cmsController.tags_index);
	contentAdminRouter.get('/categories', categoryController.loadCategoriesWithCount, categoryController.loadCategoriesWithDefaultLimit, categoryController.loadCategories, cmsController.categories_index);
	contentAdminRouter.get('/assets', assetController.loadAssetsWithCount, assetController.loadAssetsWithDefaultLimit, assetController.loadAssets, cmsController.assets_index);

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
	collectionContentAdminRouter.get('/new', cmsController.collection_new);
	collectionContentAdminRouter.get('/:id/edit', collectionController.loadCollection, cmsController.collection_edit);
	collectionContentAdminRouter.get('/:id', collectionController.loadCollection, cmsController.collection_edit);
	// // adminRouter.get('/collections/search', collectionController.loadCollections, adminController.collections_index);
	// // adminRouter.get('/collection/edit/:id/revision/:changeset', collectionController.loadCollection, adminController.collection_review_revision);
	// // adminRouter.get('/collection/edit/:id/revisions', collectionController.loadCollection, adminController.collection_revisions);
	// // adminRouter.get('/collection/search', adminController.setSearchLimitTo1000, collectionController.loadCollections, collectionController.index);
	collectionContentAdminRouter.post('/new',
		assetController.multiupload,
		assetController.create_assets_from_files,
		periodic.core.controller.save_revision,
		collectionController.create);
	collectionContentAdminRouter.post('/:id/edit',
		assetController.multiupload,
		assetController.create_assets_from_files,
		periodic.core.controller.save_revision, collectionController.loadCollection, collectionController.update);
	// collectionRouter.post('/removechangeset/:id/:contententity/:changesetnum', collectionController.loadCollection, adminController.remove_changeset_from_content, collectionController.update);
	collectionContentAdminRouter.post('/:id/delete', collectionController.loadCollection, collectionController.remove);

	/**
	//  * admin/compilation manager routes
	*/

	compilationContentAdminRouter.get('/new', cmsController.compilation_new);
	compilationContentAdminRouter.get('/:id/edit', compilationController.loadCompilation, cmsController.compilation_edit);
	compilationContentAdminRouter.get('/:id', compilationController.loadCompilation, cmsController.compilation_edit);
	// adminRouter.get('/compilations/search', compilationController.loadCompilations, adminController.compilations_index);
	// adminRouter.get('/compilation/edit/:id/revision/:changeset', compilationController.loadCompilation, adminController.compilation_review_revision);
	// adminRouter.get('/compilation/edit/:id/revisions', compilationController.loadCompilation, adminController.compilation_revisions);
	// adminRouter.get('/compilation/search', adminController.setSearchLimitTo1000, compilationController.loadCompilations, compilationController.index);
	compilationContentAdminRouter.post('/new',
		assetController.multiupload,
		assetController.create_assets_from_files,
		periodic.core.controller.save_revision,
		compilationController.create);
	compilationContentAdminRouter.post('/:id/edit',
		assetController.multiupload,
		assetController.create_assets_from_files,
		periodic.core.controller.save_revision, compilationController.loadCompilation, compilationController.update);
	// compilationRouter.post('/removechangeset/:id/:contententity/:changesetnum', compilationController.loadCompilation, adminController.remove_changeset_from_content, compilationController.update);
	compilationContentAdminRouter.post('/:id/delete', compilationController.loadCompilation, compilationController.remove);

	/**
	 * admin/asset manager routes
	 */

	// assetContentAdminRouter.get('/new', cmsController.asset_new);
	assetContentAdminRouter.get('/:id/edit', assetController.loadAsset, cmsController.asset_edit);
	assetContentAdminRouter.get('/:id', assetController.loadAsset, cmsController.asset_edit);
	// // adminRouter.get('/assets/search', assetController.loadAssets, adminController.assets_index);
	// // adminRouter.get('/asset/edit/:id/revision/:changeset', assetController.loadAsset, adminController.asset_review_revision);
	// // adminRouter.get('/asset/edit/:id/revisions', assetController.loadAsset, adminController.asset_revisions);
	// // adminRouter.get('/asset/search', adminController.setSearchLimitTo1000, assetController.loadAssets, assetController.index);
	assetContentAdminRouter.post('/new',
		assetController.multiupload,
		assetController.create_assets_from_files,
		periodic.core.controller.save_revision,
		assetController.assetcreate);
	assetContentAdminRouter.post('/:id/edit',
		assetController.multiupload,
		periodic.core.controller.save_revision,
		assetController.loadAsset,
		cmsController.update_asset_from_file,
		assetController.update);
	// // assetRouter.post('/removechangeset/:id/:contententity/:changesetnum', assetController.loadAsset, adminController.remove_changeset_from_content, assetController.update);
	assetContentAdminRouter.post('/:id/delete', assetController.loadAsset, assetController.remove);



	/**
	 * admin/tag manager routes
	 */
	tagContentAdminRouter.post('/new/:id', tagController.loadTag, tagController.create);
	tagContentAdminRouter.post('/new', tagController.loadTag, tagController.create);
	tagContentAdminRouter.post('/:id/delete', tagController.loadTag, tagController.remove);
	tagContentAdminRouter.post('/:id/edit', tagController.update);
	tagContentAdminRouter.get('/:id/edit', tagController.loadTag, cmsController.tag_edit);
	tagContentAdminRouter.get('/:id', tagController.loadTag, cmsController.tag_edit);
	tagContentAdminRouter.get('/:id/parent', tagController.loadTag, cmsController.tag_parent);


	/**
	 * admin/category manager routes
	 */
	categoryContentAdminRouter.post('/new/:id', categoryController.loadCategory, categoryController.create);
	categoryContentAdminRouter.post('/new', categoryController.loadCategory, categoryController.create);
	categoryContentAdminRouter.post('/:id/delete', categoryController.loadCategory, categoryController.remove);
	categoryContentAdminRouter.post('/:id/edit', categoryController.update);
	categoryContentAdminRouter.get('/:id/edit', categoryController.loadCategory, cmsController.category_edit);
	categoryContentAdminRouter.get('/:id', categoryController.loadCategory, cmsController.category_edit);
	categoryContentAdminRouter.get('/:id/parent', categoryController.loadCategory, cmsController.category_parent);

	/**
	 * admin/categorytype manager routes
	 */
	contenttypeContentAdminRouter.post('/new/:id', contenttypeController.loadContenttype, contenttypeController.create);
	contenttypeContentAdminRouter.post('/new', contenttypeController.loadContenttype, contenttypeController.create);
	contenttypeContentAdminRouter.post('/:id/delete', contenttypeController.loadContenttype, contenttypeController.remove);
	contenttypeRouter.post('/append/:id', contenttypeController.loadContenttype, contenttypeController.append);
	contenttypeRouter.post('/removeitem/:id', contenttypeController.loadContenttype, contenttypeController.removeitem);
	// contenttypeContentAdminRouter.get('/new', cmsController.contenttype_new);
	contenttypeContentAdminRouter.get('/:id/edit', contenttypeController.loadContenttype, cmsController.contenttype_edit);
	contenttypeContentAdminRouter.get('/:id', contenttypeController.loadContenttype, cmsController.contenttype_edit);



	/**
	 * periodic routes
	 */
	contentAdminRouter.get('/user/search.:ext', global.CoreCache.disableCache, userController.loadUsers, userController.searchResults);
	contentAdminRouter.get('/user/search', global.CoreCache.disableCache, userController.loadUsers, userController.searchResults);
	contentAdminRouter.post('/user/search/:id', global.CoreCache.disableCache, userController.loadUser, userController.show);
	contentAdminRouter.get('/category/search.:ext', global.CoreCache.disableCache, categoryController.loadCategories, categoryController.searchResults);
	contentAdminRouter.get('/category/search', global.CoreCache.disableCache, categoryController.loadCategories, categoryController.searchResults);
	contentAdminRouter.get('/category/:id/children', global.CoreCache.disableCache, categoryController.loadCategory, categoryController.loadChildren, function (req, res) {
		res.send(req.controllerData);
	});
	contentAdminRouter.get('/contenttype/search.:ext', global.CoreCache.disableCache, contenttypeController.loadContenttypes, contenttypeController.searchResults);
	contentAdminRouter.get('/contenttype/search', global.CoreCache.disableCache, contenttypeController.loadContenttypes, contenttypeController.searchResults);
	contentAdminRouter.get('/tag/search.:ext', global.CoreCache.disableCache, tagController.loadTags, tagController.searchResults);
	contentAdminRouter.get('/tag/search', global.CoreCache.disableCache, tagController.loadTags, tagController.searchResults);
	contentAdminRouter.get('/tag/:id/children', global.CoreCache.disableCache, tagController.loadTag, tagController.loadChildren, function (req, res) {
		res.send(req.controllerData);
	});

	//link routers

	contentAdminRouter.use('/item', itemContentAdminRouter);
	contentAdminRouter.use('/collection', collectionContentAdminRouter);
	contentAdminRouter.use('/compilation', compilationContentAdminRouter);
	contentAdminRouter.use('/asset', assetContentAdminRouter);
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
	periodic.app.use('/asset', assetRouter);
	return periodic;
};
