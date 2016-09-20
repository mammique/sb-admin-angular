angular.module('sbAdminApp')
    .directive('inputElement', function ($compile) {
        return {
            scope: {
                value: '=',
                param: '<',
                record: '<',
                type: '<',
            },
            link: function (scope:any, element) {
                let type = scope.param.elementType || scope.param.type;
                if (!type || scope['param'].error) {
                    type = 'error';
                }
                const componentName = 'input-' + camelToSnake(type);
                const template = `
                    <${componentName} value="value" param="param" record="record"></${componentName}>
                `;
                const contents: any = angular.element(template);
                $compile(contents)(scope);
                element.html(contents);
                function camelToSnake(p){
                    return p.replace(/([A-Z])/g,
                            function(s) {
                                return '_' + s.charAt(0).toLowerCase();
                            }
                    );
                };
            }
        };
    })
    .component('inputError', {
        template: `
        <div class="form-control" disabled>
           {{$ctrl.param.error}}
        </div>
        `,
        bindings: {
            value: '<',
            param: '<',
            record: '<',
        }
    })
    .component('inputChain', {
        template: `
        <div class="form-control" disabled>
           {{$ctrl.param.stringify($ctrl.record)}}
        </div>
        `,
        bindings: {
            value: '<',
            param: '<',
            record: '<',
        }
    })
    .component('inputCalc', {
        template: `
        <div class="form-control" disabled>
           {{$ctrl.param.stringify($ctrl.record)}}
        </div>
        `,
        bindings: {
            value: '<',
            param: '<',
            record: '<',
        }
    })
    .component('inputString', {
        template: `
           <input type="text" ng-model="$ctrl.value" class="form-control" ng-disabled="$ctrl.param.readonly" >
        `,
        bindings: {
            value: '=',
            param: '<',
        }
    })
    .component('inputMultiString', {
        template: `
           <textarea ng-model="$ctrl.value" class="form-control" ng-disabled="$ctrl.param.readonly" ></textarea>
        `,
        bindings: {
            value: '=',
            param: '<',
        }
    })
    .component('inputId', {
        template: `
            <input type="number" ng-model="$ctrl.value" class="form-control" ng-disabled="$ctrl.param.readonly" >
        `,
        bindings: {
            value: '=',
            param: '<',
        }
    })
    .component('inputInteger', {
        template: `
            <input type="number" ng-model="$ctrl.value" class="form-control" ng-disabled="$ctrl.param.readonly" >
        `,
        bindings: {
            value: '=',
            param: '<',
        }
    })
    .component('inputDate', {
        template: `
        <div class="input-group">
          <input type="text" 
            ng-model="$ctrl.value" 
            class="form-control" 
            uib-datepicker-popup="yyyy-MM-dd" 
            is-open="$ctrl.opend"
            ng-disabled="$ctrl.param.readonly"
            datepicker-options="{}"
            close-text="Close"/>
          <span class="input-group-btn">
            <button type="button" class="btn btn-default" ng-click="$ctrl.opend = true">
                <i class="glyphicon glyphicon-calendar"></i>
            </button>
          </span>
        </div>
        `,
        bindings: {
            value: '=',
            param: '<',
        }
    })
    .component('inputDatetime', {
        template: `
        <div class="input-group date">
          <input type="text" 
            ng-model="$ctrl.value" 
            class="form-control" 
            datetimepicker
            ng-disabled="$ctrl.param.readonly"
            close-text="Close"/>
            <span class="input-group-btn" style="">
                <button type="button" class="btn btn-default" ng-mousedown="$ctrl.open($event)">
                    <i class="glyphicon glyphicon-calendar"></i>
                </button>
            </span>
        </div>
        `,
        bindings: {
            value: '=',
            param: '<',
        },
        controller: class InputDatetime {
            param: any;
            value: any;
            constructor() {
                //
            }
            open($event) {
                var parent = $($event.currentTarget).closest('.input-group')
                var element = parent.find('input');
                var widget = parent.find('.bootstrap-datetimepicker-widget').length;
                if(!widget) {
                    setTimeout(()=> {
                        element.data('DateTimePicker').show();
                    }, 0);
                }
            }
        }
    })
    .component('inputReference', {
        template: `
            <div class="input-group">
                  <input 
                    uib-typeahead="item as $ctrl.stringify(item) 
                                    for item in $ctrl.param.referenceTable.records | filter:$viewValue | limitTo:8" 
                    typeahead-min-length="0"
                    type="text" class="form-control" 
                    ng-model="$ctrl.item"
                    ng-disabled="$ctrl.param.readonly" >
                  <span class="input-group-btn">
                    <button ng-click="$ctrl.selectByList()" 
                        class="btn btn-default" 
                        type="button" 
                        ng-disabled="$ctrl.param.readonly"><i class="fa fa-search"></i></button>
                  </span>
              </div>
            `,
        bindings: {
            value: '=',
            param: '<',
        },
        controller: class InputReference {
            param: any;
            value: any;
            item: any;
            constructor(public Dialog, public $scope) {
                $scope.$watch('$ctrl.value', (value) => {
                    this.item = this.param.idToItem(value);
                });
                $scope.$watch('$ctrl.item', (item) => {
                    this.value = this.param.itemToId(item);
                });
            }
            stringify(item) {
                return this.param.referenceTable && this.param.referenceTable.stringify(item);
            }
            selectByList() {
                this.Dialog.openWindow(this.param.referenceTable.listPage.extend({
                    forSelect: true
                }))
                    .then((result) => {
                        if (result) {
                            this.value = result;
                        }
                    });

            }
        }
    })
    .component('inputOption', {
        template: `
          <select chosen
                    style="width:200px;height:100px"
                    placeholder-text-single="'選択してください'"
                    disable-search="$ctrl.param.referenceTable.records.length <= 10"
                    allow-single-deselect="true"
                    ng-model="$ctrl.item"
                    ng-options="item as $ctrl.stringify(item) 
                                    for item in $ctrl.param.referenceTable.records"
                    ng-disabled="$ctrl.param.readonly" >
                <option value=""></option>
          </select>
            `,
        bindings: {
            value: '=',
            param: '<',
        },
        controller: class InputReference {
            param: any;
            value: any;
            item: any;
            constructor(public Dialog, public $scope) {
                $scope.$watch('$ctrl.value', (value) => {
                    this.item = this.param.idToItem(value);
                });
                $scope.$watch('$ctrl.item', (item) => {
                    this.value = this.param.itemToId(item);
                });
            }
            stringify(item) {
                return this.param.referenceTable && this.param.referenceTable.stringify(item);
            }
        }
    })
    .component('inputOptionMulti', {
        template: `
          <select chosen multiple
                    style="width:200px;height:100px"
                    placeholder-text-single="'選択してください'"
                    disable-search="$ctrl.param.referenceTable.records.length <= 10"
                    ng-model="$ctrl.item"
                    ng-options="item as $ctrl.stringify(item) 
                                    for item in $ctrl.param.referenceTable.records"
                    ng-disabled="$ctrl.param.readonly" >
                <option value=""></option>
          </select>
            `,
        bindings: {
            value: '=',
            param: '<',
        },
        controller: class InputReference {
            param: any;
            value: any;
            item: any;
            constructor(public Dialog, public $scope) {
                $scope.$watch('$ctrl.value', (value) => {
                    this.item = this.param.idToItem(value);
                });
                $scope.$watch('$ctrl.item', (item) => {
                    this.value = this.param.itemToId(item);
                });
            }
            stringify(item) {
                return this.param.referenceTable && this.param.referenceTable.stringify(item);
            }
        }
    });

