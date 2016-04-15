'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('sbAdminApp')
    .component('stats',{
        templateUrl:'components/dashboard/stats/stats.html',
        bindings: {
            'model': '=',
            'comments': '@',
            'number': '@',
            'name': '@',
            'colour': '@',
            'details':'@',
            'type':'@',
            'goto':'@'
        }

    });
