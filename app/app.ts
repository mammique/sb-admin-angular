'use strict';
/**
 * @ngdoc overview
 * @name sbAdminApp
 * @description
 * # sbAdminApp
 *
 * Main module of the application.
 */
angular
    .module('sbAdminApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngTouch',
        'oc.lazyLoad',
        'ui.router',
        'ui.bootstrap',
        'angular-loading-bar',
        'localytics.directives',
        'datetimepicker',
    ])
    .config(['$stateProvider','$urlRouterProvider','$ocLazyLoadProvider',function ($stateProvider,$urlRouterProvider,$ocLazyLoadProvider) {
        console.log('start');
        $ocLazyLoadProvider.config({
            debug:false,
            events:true,
        });

        $urlRouterProvider.otherwise('/dashboard');

        $stateProvider
            .state('login',{
                url:'/login',
                template: '<login></login>',
                resolve: {
                    loadMyDirectives:function($ocLazyLoad){
                        return $ocLazyLoad.load(
                            {
                                name:'sbAdminApp',
                                files:[
                                    'components/login/login.js',
                                ]
                            });
                    }
                }
            })
            .state('dashboard', {
                url:'/dashboard',
                template: '<main></main>',
                resolve: {
                    loadMyDirectives:function($ocLazyLoad){
                        return $ocLazyLoad.load(
                            {
                                name:'sbAdminApp',
                                files:[
                                    'components/main/main.js',
                                    'components/header/header.js',
                                    'components/header/header-notification/header-notification.js',
                                    'components/sidebar/sidebar.js',
                                    'components/sidebar/sidebar-search/sidebar-search.js',
                                    'services/dialog.js',
                                    'services/schema.js',
                                    'components/input-elements/input-element.js',
                                    'components/search-elements/search-element.js',
                                ]
                            });
                    },
                    schema: function(Schema, loadMyDirectives){
                        return Schema.$promise;
                    }
                }
            })
            .state('dashboard.page',{
                template:'<root-page></root-page>',
                url:'/page/:pageId/:recordId',
                resolve: {
                    loadMyFile:function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name:'sbAdminApp',
                            files:[
                                'components/rootPage/rootPage.js',
                                'components/page/page.js',
                            ]
                        });
                    }
                }
            });
    }]);


