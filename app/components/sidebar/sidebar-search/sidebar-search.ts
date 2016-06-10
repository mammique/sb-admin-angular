'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */

angular.module('sbAdminApp')
    .component('sidebarSearch',{
        templateUrl:'components/sidebar/sidebar-search/sidebar-search.html',
        controller: class SidebarSearch{
            selectedMenu = 'home';
        }
    });
