class ComponentBase {
    param: any;
    value: any;
}

angular.module('sbAdminApp')
    .directive('pageElement', function ($compile) {
        return {
            scope: {
                value: '<',
                param: '<',
                $onClose: '&onClose',
            },
            bindToController: true,
            controllerAs: '$ctrl',
            link: function (scope, element) {
                scope.$watch('$ctrl.param.type', function (type) {
                    var componentName = 'page-' + type;
                    var template = `
							<${componentName} value="$ctrl.value" param="$ctrl.param" on-close="$ctrl.onClose(result)"></${componentName}>
						`;
                    var contents: any = angular.element(template);
                    $compile(contents)(scope);
                    element.html(contents);
                });
            },
            controller: class PageElement {
                $onClose(value) {
                    //
                }
                constructor(private $scope) { }
                onClose(result) {
                    this.$onClose({ result: result });
                }
            }
        };
    })
    .component('pageList', {
        templateUrl: 'components/page/page-list.html',
        bindings: {
            param: '<',
            value: '<',
            $onClose: '&onClose',
        },
        controller: class ComponentList extends ComponentBase {
            public records;
            public conditions = {};
            sortField;
            sortMode;
            constructor(private Dialog, private $scope) {
                super();
                $scope.$watch('$ctrl.value', (value) => {
                    this.updateList();
                }, true);
                $scope.$watch('$ctrl.conditions', (value) => {
                    this.updateList();
                }, true);
                $scope.$watch('$ctrl.sortField', (value) => {
                    this.updateList();
                });
                $scope.$watch('$ctrl.sortMode', (value) => {
                    this.updateList();
                });
            }
            $onClose(value) { }//overwriten by bindings
            // select modeの時に使われる
            select(value) {
                this.$onClose({
                    result: value[this.param.table.primaryKey]
                });
            }
            updateList() {
                const conditionString = JSON.stringify(Object.assign({}, this.value, this.conditions));
                this.records = this.param.table.search(conditionString);
                if(this.sortMode > 0) {
                    this.records.sort((a, b)=> {
                        if(a[this.sortField] > b[this.sortField]) {return 1;}
                        if(a[this.sortField] < b[this.sortField]) {return -1;}
                        return 0;
                    });
                }else if(this.sortMode < 0) {
                    this.records.sort((a, b)=> {
                        if(a[this.sortField] > b[this.sortField]) {return -1;}
                        if(a[this.sortField] < b[this.sortField]) {return 1;}
                        return 0;
                    });
                }
            }
            action(action, value) {
                if (action.error) {
                    this.Dialog.openDialog({
                        title: 'error',
                        message: action.error,
                        actions: [
                            { caption: 'ok', color: 'primary', result: 'ok' }
                        ]
                    });
                } else if (action.type === 'link') {
                    this.Dialog.openWindow(action.page, value && value[this.param.table.primaryKey] && {
                        [this.param.table.primaryKey]: value[this.param.table.primaryKey]
                    } || value)
                        .then(() => {
                            this.updateList();
                        });
                } else if (action.type === 'previewRecords') {
                    this.Dialog.openPreviewWindow(this.param.table.title, this.param.table.records)
                        .then(() => {
                            //
                        });
                }
            }
        }
    })
    .component('pageRecord', {
        templateUrl: 'components/page/page-record.html',
        bindings: {
            param: '<',
            value: '<',
            $onClose: '&onClose',
        },
        controller: class ComponentRecord extends ComponentBase {
            model: any;
            constructor(private Dialog, private $scope) {
                super();
            }
            $postLink() {
                if (this.value && this.value[this.param.table.primaryKey]) {
                    this.model = angular.copy(this.param.table.get(this.value[this.param.table.primaryKey]));
                } else {
                    this.model = Object.assign(angular.copy(this.value) || {}, this.param.defaultValue());
                }
            }
            $onClose(value) { }//overwriten by bindings
            action(action, value) {
                if (action.type === 'save') {
                    this.Dialog.openDialogWithPreset('save')
                        .then((result) => {
                            if (result === 'ok') {
                                this.param.table.save(this.model);
                            }
                            if (result) {
                                this.$onClose({ result: this.model });
                            }
                        });
                } else if (action.type === 'link') {
                    this.Dialog.openWindow(action.page, value && value[this.param.table.primaryKey] && {
                        [this.param.table.primaryKey]: value[this.param.table.primaryKey]
                    } || value)
                        .then(() => {
                            // this.updateList();
                        });
                }
            }
        }
    })
    .component('pageComplex', {
        template: `
        <div ng-if="$ctrl.value || !page.hideOnCreate" 
            class="panel panel-default" 
            ng-repeat="page in $ctrl.param.children track by $index" >
            <div class="panel-heading" ng-if="page.title">
                {{page.title}}
            </div>
            <div class="panel-body">
				<page-element value="$ctrl.value" param="page" on-close="$ctrl.onClose({result: result})"></page-element>
            </div>
		</div>
		`,
        bindings: {
            param: '<',
            value: '<',
            onClose: '&',
        },
        controller: class ComponentComplex extends ComponentBase {
        }
    })
    .component('sortButton', {
        template: `<span style="color:#337ab7" ng-click="$ctrl.toggle()" class="fa fa-{{$ctrl.getClassName()}}"></span>`,
        bindings: {
            mode: '=',
            currentField: '<',
            selectedField: '=',
        },
        controller: class SortButton {
            mode = 0;
            currentField;
            selectedField;
            getClassName() {
                if (this.selectedField === this.currentField) {
                    if (this.mode > 0) {
                        return 'sort-amount-asc';
                    } else if (this.mode < 0) {
                        return 'sort-amount-desc';
                    }
                }
                return 'sort';
            }
            toggle() {
                if(this.selectedField !== this.currentField){
                    this.selectedField = this.currentField;
                    this.mode = 1;
                }else if (this.mode > 0) {
                    this.mode = -1;
                } else if (this.mode < 0) {
                    this.selectedField = null;
                    this.mode = 0;
                } else {
                    this.mode = 1;
                }
            }
        }
    });
