'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */

angular.module('sbAdminApp')
    .component('rootPage', {
            template: `
				<div class="row">
					<div class="col-lg-12">
						<h1 class="page-header">{{$ctrl.param.title || $ctrl.param.table.title}}</h1>
					</div>
				</div>
				<div class="row">
					<div class="col-lg-12">
						<page-element value="$ctrl.value" param="$ctrl.param"></page-element>
					</div>
				</div>
			`,
            controller: class RootPage{
                param:any;
                value:any;
                constructor($stateParams, Schema) {
                    this.param = Schema.pages[$stateParams.pageId];
                    if($stateParams.recordId) {
                        const condition = JSON.parse($stateParams.recordId);
                        if(angular.isString(condition) || angular.isNumber(condition)) {
                            if(!this.param.table) {
                                debugger;
                            }
                            this.value = {[this.param.table.primaryKey]: condition};
                        }else {
                            this.value = condition;
                        }
                    }
                }
            }
        }
    );


