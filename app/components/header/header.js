'use strict';
/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('sbAdminApp')
    .component('header', {
    templateUrl: 'components/header/header.html',
    controller: (function () {
        function Header(Schema) {
            this.title = Schema.common.title;
        }
        return Header;
    }())
});

//# sourceMappingURL=header.js.map
