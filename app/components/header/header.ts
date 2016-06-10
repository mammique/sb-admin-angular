'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('sbAdminApp')
	.component('header',{
		templateUrl:'components/header/header.html',
		controller: class Header {
			title;
			constructor(Schema) {
				this.title = Schema.common.title;
			}
		}
	});


