/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('sbAdminApp')
    .component('sidebar', {
    templateUrl: 'components/sidebar/sidebar.html',
    controller: (function () {
        function Sidebar(Schema) {
            this.collapseVar = 0;
            this.multiCollapseVar = 0;
            this.srefOption = { inherit: false };
            this.debug = '';
            this.menu = Schema.menu;
        }
        Sidebar.prototype.check = function (x) {
            if (x === this.collapseVar) {
                this.collapseVar = 0;
            }
            else {
                this.collapseVar = x;
            }
        };
        Sidebar.prototype.multiCheck = function (y) {
            if (y === this.multiCollapseVar) {
                this.multiCollapseVar = 0;
            }
            else {
                this.multiCollapseVar = y;
            }
        };
        return Sidebar;
    }())
});

//# sourceMappingURL=sidebar.js.map
