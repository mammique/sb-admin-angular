/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */

angular.module('sbAdminApp')
    .component('sidebar',{
        templateUrl:'components/sidebar/sidebar.html',
        controller: class Sidebar{
            menu:any;
            collapseVar:number = 0;
            multiCollapseVar:number = 0;
            srefOption = {inherit: false};
            debug = '';
            constructor(Schema) {
                this.menu = Schema.menu;
            }
            check(x) {
                if(x === this.collapseVar) {
                    this.collapseVar = 0;
                }else {
                    this.collapseVar = x;
                }
            }
            multiCheck(y) {
                if(y === this.multiCollapseVar) {
                    this.multiCollapseVar = 0;
                }else {
                    this.multiCollapseVar = y;
                }
            }
        }
    });

