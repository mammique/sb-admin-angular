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
    ])
    .config(['$stateProvider','$urlRouterProvider','$ocLazyLoadProvider',function ($stateProvider,$urlRouterProvider,$ocLazyLoadProvider) {

        $ocLazyLoadProvider.config({
            debug:false,
            events:true,
        });

        $urlRouterProvider.otherwise('/dashboard/home');

        $stateProvider
            .state('dashboard', {
                url:'/dashboard',
                templateUrl: 'pages/main.html',
                resolve: {
                    loadMyDirectives:function($ocLazyLoad){
                        return $ocLazyLoad.load(
                            {
                                name:'sbAdminApp',
                                files:[
                                    'components/header/header.js',
                                    'components/header/header-notification/header-notification.js',
                                    'components/sidebar/sidebar.js',
                                    'components/sidebar/sidebar-search/sidebar-search.js'
                                ]
                            })
                    }
                }
            })
            .state('dashboard.home',{
                url:'/home',
                controller: 'MainCtrl',
                templateUrl:'pages/main/home.html',
                resolve: {
                    loadMyFiles:function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name:'sbAdminApp',
                            files:[
                                'pages/main.js',
                                'components/timeline/timeline.js',
                                'components/notifications/notifications.js',
                                'components/chat/chat.js',
                                'components/dashboard/stats/stats.js'
                            ]
                        })
                    }
                }
            })
            .state('dashboard.form',{
                templateUrl:'pages/main/form.html',
                url:'/form'
            })
            .state('dashboard.blank',{
                templateUrl:'pages/main/blank.html',
                url:'/blank'
            })
            .state('login',{
                templateUrl:'pages/login.html',
                url:'/login'
            })
            .state('dashboard.chart',{
                templateUrl:'pages/main/chart.html',
                url:'/chart',
                controller:'ChartCtrl',
                resolve: {
                    loadMyFile:function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name:'chart.js',
                            files:[
                                'bower_components/angular-chart.js/dist/angular-chart.min.js',
                                'bower_components/angular-chart.js/dist/angular-chart.css'
                            ]
                        }),
                            $ocLazyLoad.load({
                                name:'sbAdminApp',
                                files:['pages/main/chart.js']
                            })
                    }
                }
            })
            .state('dashboard.table',{
                templateUrl:'pages/main/table.html',
                url:'/table'
            })
            .state('dashboard.panels-wells',{
                templateUrl:'pages/main/ui-elements/panels-wells.html',
                url:'/panels-wells'
            })
            .state('dashboard.buttons',{
                templateUrl:'pages/main/ui-elements/buttons.html',
                url:'/buttons'
            })
            .state('dashboard.notifications',{
                templateUrl:'pages/main/ui-elements/notifications.html',
                url:'/notifications'
            })
            .state('dashboard.typography',{
                templateUrl:'pages/main/ui-elements/typography.html',
                url:'/typography'
            })
            .state('dashboard.icons',{
                templateUrl:'pages/main/ui-elements/icons.html',
                url:'/icons'
            })
            .state('dashboard.grid',{
                templateUrl:'pages/main/ui-elements/grid.html',
                url:'/grid'
            })
    }]);


