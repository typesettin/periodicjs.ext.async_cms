'use strict';

var Errorie = require('errorie'),
    asyncadminInstalled,
    path = require('path'),
    fs = require('fs-extra'),
    extend = require('utils-merge'),
    // cms_view_helpers = require('./controller/cms_view_helpers'),
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
module.exports = function(periodic) {
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
        throw new Errorie({
            name: 'Extension: async_cms',
            message: 'Your application extension configuriation is missing periodicjs.ext.asyncadmin'
        });
    }

    // periodic.app.locals.cms_default_responsive_collapse = cms_view_helpers.cms_default_responsive_collapse;
    // periodic.app.locals.cms_default_tbody = cms_view_helpers.cms_default_tbody;
    var contentAdminRouter = periodic.express.Router(),
        itemRouter = periodic.express.Router(),
        itemContentAdminRouter = periodic.express.Router(),
        dataRouter = periodic.express.Router(),
        dataContentAdminRouter = periodic.express.Router(),
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
        dataController = periodic.app.controller.native.data,
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
    var asyncadminController = periodic.app.controller.extension.asyncadmin.admin;

    /**
     * access control routes
     */
    contentAdminRouter.all('*', global.CoreCache.disableCache, authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
    itemRouter.post('*', global.CoreCache.disableCache, authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
    dataRouter.post('*', global.CoreCache.disableCache, authController.ensureAuthenticated, uacController.loadUserRoles, uacController.check_user_access);
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
    contentAdminRouter.get('/items', cmsController.remove_content_and_changes, itemController.loadItemsWithCount, itemController.loadItemsWithDefaultLimit, itemController.loadItems, cmsController.items_index);
    contentAdminRouter.get('/datas', cmsController.remove_content_and_changes, dataController.loadDatasWithCount, dataController.loadDatasWithDefaultLimit, dataController.loadDatas, cmsController.datas_index);
    contentAdminRouter.get('/collections', cmsController.remove_content_and_changes, collectionController.loadCollectionsWithCount, collectionController.loadCollectionsWithDefaultLimit, collectionController.loadCollections, cmsController.collections_index);
    contentAdminRouter.get('/compilations', cmsController.remove_content_and_changes, compilationController.loadCompilationsWithCount, compilationController.loadCompilationsWithDefaultLimit, compilationController.loadCompilations, cmsController.compilations_index);
    contentAdminRouter.get('/contenttypes', cmsController.remove_content_and_changes, contenttypeController.loadContenttypesWithCount, contenttypeController.loadContenttypesWithDefaultLimit, contenttypeController.loadContenttypes, cmsController.contenttypes_index);
    contentAdminRouter.get('/tags', cmsController.remove_content_and_changes, tagController.loadTagsWithCount, tagController.loadTagsWithDefaultLimit, tagController.loadTags, cmsController.tags_index);
    contentAdminRouter.get('/categories', cmsController.remove_content_and_changes, categoryController.loadCategoriesWithCount, categoryController.loadCategoriesWithDefaultLimit, categoryController.loadCategories, cmsController.categories_index);
    contentAdminRouter.get('/assets', cmsController.remove_content_and_changes, assetController.loadAssetsWithCount, assetController.loadAssetsWithDefaultLimit, assetController.loadAssets, cmsController.assets_index);


    periodic.app.controller.extension.asyncadmin.search.item = cmsController.item_search;
    periodic.app.controller.extension.asyncadmin.search.data = cmsController.data_search;
    periodic.app.controller.extension.asyncadmin.search.collection = cmsController.collection_search;
    periodic.app.controller.extension.asyncadmin.search.compilation = cmsController.compilation_search;
    periodic.app.controller.extension.asyncadmin.search.contenttype = cmsController.contenttype_search;
    periodic.app.controller.extension.asyncadmin.search.tag = cmsController.tag_search;
    periodic.app.controller.extension.asyncadmin.search.category = cmsController.category_search;
    periodic.app.controller.extension.asyncadmin.search.asset = cmsController.asset_search;

    // contentAdminRouter.get('/extensions', cmsController.loadExtensions, cmsController.extensions_index);
    // contentAdminRouter.get('/themes', cmsController.loadThemes, adminSettingsController.load_theme_settings, cmsController.themes_index);
    // contentAdminRouter.get('/users', userController.loadUsersWithCount, userController.loadUsersWithDefaultLimit, uacController.loadUacUsers, cmsController.users_index);
    // contentAdminRouter.get('/mailer', cmsController.mail_index);
    // contentAdminRouter.get('/check_periodic_version', cmsController.check_periodic_version);

    /**
     * admin/data manager routes
     */

    dataContentAdminRouter.get('/new', cmsController.data_new);
    dataContentAdminRouter.get('/:id/edit', dataController.loadFullData, cmsController.data_edit);
    dataContentAdminRouter.get('/:id', dataController.loadFullData, cmsController.data_edit);
    // adminRouter.get('/datas/search', dataController.loadDatas, adminController.datas_index);
    // adminRouter.get('/data/search', adminController.setSearchLimitTo1000, dataController.loadDatas, dataController.index);
    dataContentAdminRouter.post('/new',
        assetController.multiupload,
        assetController.create_assets_from_files,
        periodic.core.controller.save_revision,
        dataController.create);
    dataContentAdminRouter.post('/:id/edit',
        assetController.multiupload,
        assetController.create_assets_from_files,
        periodic.core.controller.save_revision,
        dataController.loadData,
        asyncadminController.fixCodeMirrorSubmit,
        dataController.update);
    // dataRouter.post('/removechangeset/:id/:contententity/:changesetnum', dataController.loadData, adminController.remove_changeset_from_content, dataController.update);
    dataContentAdminRouter.post('/:id/delete', dataController.loadData, dataController.remove);

    dataContentAdminRouter.get('/:id/revisions', periodic.app.controller.extension.asyncadmin.admin.skip_population, dataController.loadFullData, cmsController.data_revisions);
    dataContentAdminRouter.post('/:id/revision/:revisionindex/delete', periodic.app.controller.extension.asyncadmin.admin.skip_population, dataController.loadFullData, periodic.app.controller.extension.asyncadmin.admin.revision_delete, dataController.update);
    dataContentAdminRouter.post('/:id/revision/:revisionindex/revert', periodic.app.controller.extension.asyncadmin.admin.skip_population, dataController.loadFullData, periodic.app.controller.extension.asyncadmin.admin.revision_revert, dataController.update);

    /**
     * admin/item manager routes
     */

    itemContentAdminRouter.get('/new', cmsController.item_new);
    itemContentAdminRouter.get('/:id/edit', itemController.loadFullItem, cmsController.item_edit);
    itemContentAdminRouter.get('/:id', itemController.loadFullItem, cmsController.item_edit);

    // adminRouter.get('/item/search', adminController.setSearchLimitTo1000, itemController.loadItems, itemController.index);
    itemContentAdminRouter.post('/new',
        assetController.multiupload,
        assetController.create_assets_from_files,
        periodic.core.controller.save_revision,
        itemController.create);
    itemContentAdminRouter.post('/:id/edit',
        assetController.multiupload,
        assetController.create_assets_from_files,
        periodic.core.controller.save_revision, itemController.loadItem, asyncadminController.fixCodeMirrorSubmit, itemController.update);

    itemContentAdminRouter.post('/:id/delete', itemController.loadItem, itemController.remove);

    itemContentAdminRouter.get('/:id/revisions', periodic.app.controller.extension.asyncadmin.admin.skip_population, itemController.loadFullItem, cmsController.item_revisions);
    itemContentAdminRouter.post('/:id/revision/:revisionindex/delete', periodic.app.controller.extension.asyncadmin.admin.skip_population, itemController.loadFullItem, periodic.app.controller.extension.asyncadmin.admin.revision_delete, itemController.update);
    itemContentAdminRouter.post('/:id/revision/:revisionindex/revert', periodic.app.controller.extension.asyncadmin.admin.skip_population, itemController.loadFullItem, periodic.app.controller.extension.asyncadmin.admin.revision_revert, itemController.update);

    /**
     * admin/collection manager routes
     */
    collectionContentAdminRouter.get('/new', cmsController.collection_new);
    collectionContentAdminRouter.get('/:id/edit', collectionController.loadCollection, cmsController.collection_edit);
    collectionContentAdminRouter.get('/:id', collectionController.loadCollection, cmsController.collection_edit);
    // // adminRouter.get('/collections/search', collectionController.loadCollections, adminController.collections_index);
    // // adminRouter.get('/collection/search', adminController.setSearchLimitTo1000, collectionController.loadCollections, collectionController.index);
    collectionContentAdminRouter.post('/new',
        assetController.multiupload,
        assetController.create_assets_from_files,
        periodic.core.controller.save_revision,
        collectionController.create);
    collectionContentAdminRouter.post('/:id/edit',
        assetController.multiupload,
        assetController.create_assets_from_files,
        periodic.core.controller.save_revision, collectionController.loadCollection, asyncadminController.fixCodeMirrorSubmit, collectionController.update);
    collectionContentAdminRouter.post('/:id/delete', collectionController.loadCollection, collectionController.remove);
    collectionContentAdminRouter.get('/:id/revisions', periodic.app.controller.extension.asyncadmin.admin.skip_population, collectionController.loadFullCollection, cmsController.collection_revisions);
    collectionContentAdminRouter.post('/:id/revision/:revisionindex/delete', periodic.app.controller.extension.asyncadmin.admin.skip_population, collectionController.loadFullCollection, periodic.app.controller.extension.asyncadmin.admin.revision_delete, collectionController.update);
    collectionContentAdminRouter.post('/:id/revision/:revisionindex/revert', periodic.app.controller.extension.asyncadmin.admin.skip_population, collectionController.loadFullCollection, periodic.app.controller.extension.asyncadmin.admin.revision_revert, collectionController.update);


    /**
    //  * admin/compilation manager routes
    */

    compilationContentAdminRouter.get('/new', cmsController.compilation_new);
    compilationContentAdminRouter.get('/:id/edit', compilationController.loadCompilation, cmsController.compilation_edit);
    compilationContentAdminRouter.get('/:id', compilationController.loadCompilation, cmsController.compilation_edit);
    // adminRouter.get('/compilations/search', compilationController.loadCompilations, adminController.compilations_index);
    // adminRouter.get('/compilation/search', adminController.setSearchLimitTo1000, compilationController.loadCompilations, compilationController.index);
    compilationContentAdminRouter.post('/new',
        assetController.multiupload,
        assetController.create_assets_from_files,
        periodic.core.controller.save_revision,
        compilationController.create);
    compilationContentAdminRouter.post('/:id/edit',
        assetController.multiupload,
        assetController.create_assets_from_files,
        periodic.core.controller.save_revision, compilationController.loadCompilation, asyncadminController.fixCodeMirrorSubmit, compilationController.update);
    compilationContentAdminRouter.post('/:id/delete', compilationController.loadCompilation, compilationController.remove);


    compilationContentAdminRouter.get('/:id/revisions', periodic.app.controller.extension.asyncadmin.admin.skip_population, compilationController.loadFullCompilation, cmsController.compilation_revisions);
    compilationContentAdminRouter.post('/:id/revision/:revisionindex/delete', periodic.app.controller.extension.asyncadmin.admin.skip_population, compilationController.loadFullCompilation, periodic.app.controller.extension.asyncadmin.admin.revision_delete, compilationController.update);
    compilationContentAdminRouter.post('/:id/revision/:revisionindex/revert', periodic.app.controller.extension.asyncadmin.admin.skip_population, compilationController.loadFullCompilation, periodic.app.controller.extension.asyncadmin.admin.revision_revert, compilationController.update);

    /**
     * admin/asset manager routes
     */

    // assetContentAdminRouter.get('/new', cmsController.asset_new);
    assetContentAdminRouter.get('/:id/edit', assetController.loadAsset, cmsController.asset_edit);
    assetContentAdminRouter.get('/:id', assetController.loadAsset, cmsController.asset_edit);
    // // adminRouter.get('/assets/search', assetController.loadAssets, adminController.assets_index);
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
        asyncadminController.fixCodeMirrorSubmit,
        cmsController.update_asset_from_file,
        assetController.update);
    assetContentAdminRouter.post('/:id/delete', assetController.loadAsset, assetController.remove);


    assetContentAdminRouter.get('/:id/revisions', periodic.app.controller.extension.asyncadmin.admin.skip_population, assetController.loadFullAsset, cmsController.asset_revisions);
    assetContentAdminRouter.post('/:id/revision/:revisionindex/delete', periodic.app.controller.extension.asyncadmin.admin.skip_population, assetController.loadFullAsset, periodic.app.controller.extension.asyncadmin.admin.revision_delete, assetController.update);
    assetContentAdminRouter.post('/:id/revision/:revisionindex/revert', periodic.app.controller.extension.asyncadmin.admin.skip_population, assetController.loadFullAsset, periodic.app.controller.extension.asyncadmin.admin.revision_revert, assetController.update);

    /**
     * admin/tag manager routes
     */
    tagContentAdminRouter.post('/new/:id', tagController.loadTag, tagController.create);
    tagContentAdminRouter.post('/new', tagController.loadTag, tagController.create);
    tagContentAdminRouter.post('/:id/delete', tagController.loadTag, tagController.remove);
    tagContentAdminRouter.get('/:id/edit', tagController.loadTag, cmsController.tag_edit);
    tagContentAdminRouter.get('/:id', tagController.loadTag, cmsController.tag_edit);
    tagContentAdminRouter.get('/:id/parent', tagController.loadTag, cmsController.tag_parent);
    tagContentAdminRouter.post('/:id/edit',
        periodic.core.controller.save_revision, tagController.loadTag, asyncadminController.fixCodeMirrorSubmit, tagController.update, cmsController.tag_edit);
    tagContentAdminRouter.post('/:id/edit', periodic.core.controller.save_revision, tagController.update);

    tagContentAdminRouter.get('/:id/revisions', periodic.app.controller.extension.asyncadmin.admin.skip_population, tagController.loadFullTag, cmsController.tag_revisions);
    tagContentAdminRouter.post('/:id/revision/:revisionindex/delete', periodic.app.controller.extension.asyncadmin.admin.skip_population, tagController.loadFullTag, periodic.app.controller.extension.asyncadmin.admin.revision_delete, tagController.update);
    tagContentAdminRouter.post('/:id/revision/:revisionindex/revert', periodic.app.controller.extension.asyncadmin.admin.skip_population, tagController.loadFullTag, periodic.app.controller.extension.asyncadmin.admin.revision_revert, tagController.update);

    /**
     * admin/category manager routes
     */
    categoryContentAdminRouter.post('/new/:id', categoryController.loadCategory, categoryController.create);
    categoryContentAdminRouter.post('/new', categoryController.loadCategory, categoryController.create);
    categoryContentAdminRouter.post('/:id/delete', categoryController.loadCategory, categoryController.remove);
    categoryContentAdminRouter.get('/:id/edit', categoryController.loadCategory, cmsController.category_edit);
    categoryContentAdminRouter.get('/:id', categoryController.loadCategory, cmsController.category_edit);
    categoryContentAdminRouter.get('/:id/parent', categoryController.loadCategory, cmsController.category_parent);

    categoryContentAdminRouter.post('/:id/edit',
        periodic.core.controller.save_revision, categoryController.loadCategory, asyncadminController.fixCodeMirrorSubmit, categoryController.update, cmsController.category_edit);
    categoryContentAdminRouter.post('/:id/edit', periodic.core.controller.save_revision, categoryController.update);


    categoryContentAdminRouter.get('/:id/revisions', periodic.app.controller.extension.asyncadmin.admin.skip_population, categoryController.loadFullCategory, cmsController.category_revisions);
    categoryContentAdminRouter.post('/:id/revision/:revisionindex/delete', periodic.app.controller.extension.asyncadmin.admin.skip_population, categoryController.loadFullCategory, periodic.app.controller.extension.asyncadmin.admin.revision_delete, categoryController.update);
    categoryContentAdminRouter.post('/:id/revision/:revisionindex/revert', periodic.app.controller.extension.asyncadmin.admin.skip_population, categoryController.loadFullCategory, periodic.app.controller.extension.asyncadmin.admin.revision_revert, categoryController.update);
    /**
     * admin/categorytype manager routes
     */
    contenttypeContentAdminRouter.post('/new/:id', contenttypeController.loadContenttype, contenttypeController.create);
    contenttypeContentAdminRouter.post('/new', contenttypeController.loadContenttype, contenttypeController.create);
    contenttypeContentAdminRouter.post('/:id/delete',
        periodic.core.controller.save_revision, contenttypeController.loadContenttype, contenttypeController.remove);
    contenttypeRouter.post('/append/:id',
        periodic.core.controller.save_revision, contenttypeController.loadContenttype, contenttypeController.append);
    contenttypeRouter.post('/removeitem/:id',
        periodic.core.controller.save_revision, contenttypeController.loadContenttype, contenttypeController.removeitem);
    // contenttypeContentAdminRouter.get('/new', cmsController.contenttype_new);
    contenttypeContentAdminRouter.get('/:id/edit', contenttypeController.loadContenttype, cmsController.contenttype_edit);
    contenttypeContentAdminRouter.get('/:id', contenttypeController.loadContenttype, cmsController.contenttype_edit);
    contenttypeContentAdminRouter.post('/:id/edit',
        periodic.core.controller.save_revision, contenttypeController.loadContenttype, asyncadminController.fixCodeMirrorSubmit, contenttypeController.update, cmsController.contenttype_edit);



    contenttypeContentAdminRouter.get('/:id/revisions', periodic.app.controller.extension.asyncadmin.admin.skip_population, contenttypeController.loadFullContenttype, cmsController.contenttype_revisions);
    contenttypeContentAdminRouter.post('/:id/revision/:revisionindex/delete', periodic.app.controller.extension.asyncadmin.admin.skip_population, contenttypeController.loadFullContenttype, periodic.app.controller.extension.asyncadmin.admin.revision_delete, contenttypeController.update);
    contenttypeContentAdminRouter.post('/:id/revision/:revisionindex/revert', periodic.app.controller.extension.asyncadmin.admin.skip_population, contenttypeController.loadFullContenttype, periodic.app.controller.extension.asyncadmin.admin.revision_revert, contenttypeController.update);
    /**
     * periodic routes
     */
    contentAdminRouter.get('/user/search.:ext', global.CoreCache.disableCache, userController.loadUsers, userController.searchResults);
    contentAdminRouter.get('/user/search', global.CoreCache.disableCache, userController.loadUsers, userController.searchResults);
    contentAdminRouter.post('/user/search/:id', global.CoreCache.disableCache, userController.loadUser, function(req, res) {
        console.log('req.controllerData', req.controllerData);
        res.send(req.controllerData.user);
    });
    contentAdminRouter.get('/category/search.:ext', global.CoreCache.disableCache, categoryController.loadCategories, categoryController.searchResults);
    contentAdminRouter.get('/category/search', global.CoreCache.disableCache, categoryController.loadCategories, categoryController.searchResults);
    contentAdminRouter.get('/category/:id/children', global.CoreCache.disableCache, categoryController.loadCategory, categoryController.loadChildren, function(req, res) {
        res.send(req.controllerData);
    });
    contentAdminRouter.get('/contenttype/search.:ext', global.CoreCache.disableCache, contenttypeController.loadContenttypes, contenttypeController.searchResults);
    contentAdminRouter.get('/contenttype/search', global.CoreCache.disableCache, contenttypeController.loadContenttypes, contenttypeController.searchResults);
    contentAdminRouter.get('/tag/search.:ext', global.CoreCache.disableCache, tagController.loadTags, tagController.searchResults);
    contentAdminRouter.get('/tag/search', global.CoreCache.disableCache, tagController.loadTags, tagController.searchResults);
    contentAdminRouter.get('/tag/:id/children', global.CoreCache.disableCache, tagController.loadTag, tagController.loadChildren, function(req, res) {
        res.send(req.controllerData);
    });


    var usehtmlxss = function(req, res, next) {
        req.controllerData = Object.assign({}, req.controllerData, { html_xss: true });
        next();
    };

    //link routers
    // console.log('periodic.app.locals.adminPath', periodic.app.locals.adminPath);
    contentAdminRouter.use('/item', usehtmlxss, itemContentAdminRouter);
    contentAdminRouter.use('/data', usehtmlxss, dataContentAdminRouter);
    contentAdminRouter.use('/collection', usehtmlxss, collectionContentAdminRouter);
    contentAdminRouter.use('/compilation', usehtmlxss, compilationContentAdminRouter);
    contentAdminRouter.use('/asset', usehtmlxss, assetContentAdminRouter);
    contentAdminRouter.use('/contenttype', usehtmlxss, contenttypeContentAdminRouter);
    contentAdminRouter.use('/tag', usehtmlxss, tagContentAdminRouter);
    contentAdminRouter.use('/category', usehtmlxss, categoryContentAdminRouter);
    periodic.app.use('/' + periodic.app.locals.adminPath + '/content', usehtmlxss, contentAdminRouter);

    periodic.app.get('/p-secure/asset/:id/:filename', assetController.loadAsset, assetController.decryptAsset);

    periodic.app.use('/data', dataRouter);
    periodic.app.use('/item', itemRouter);
    periodic.app.use('/collection', collectionRouter);
    periodic.app.use('/compilation', compilationRouter);
    periodic.app.use('/tag', tagRouter);
    periodic.app.use('/category', categoryRouter);
    periodic.app.use('/contenttype', contenttypeRouter);
    periodic.app.use('/asset', assetRouter);
    return periodic;
};