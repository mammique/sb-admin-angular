'use strict';

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
      constructor(){
        this.menu = layout.menu;
        this.collapseVar = 0;
        this.multiCollapseVar = 0;
      }
      check(x){
        if(x==this.collapseVar)
          this.collapseVar = 0;
        else
          this.collapseVar = x;
      }
      multiCheck(y){
        if(y==this.multiCollapseVar)
          this.multiCollapseVar = 0;
        else
          this.multiCollapseVar = y;
      }
    }
  });
