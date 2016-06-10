angular.module('sbAdminApp')
    .directive('searchElement', function($compile) {
        return {
            scope: {
                value: '=',
                param: '<',
                condition: '<',
                type: '<',
            },
            link: function(scope:any, element){
                scope.$watch('type', function(){
                    let type = scope.param.elementType || scope.param.type;
                    if(scope['param'].error) {
                        type = 'error';
                    }
                    const conditionTypesMap = {
                        'partial': ['._$text._$search'],
                        'suffix': ['._$suffix._$search'],
                        'prefix': ['._$prefix._$search'],
                        'exact': [''],
                        'multi': [''],// 実際には_$inだが、未対応のため。
                        'range': ['._$gte', '._$lt'],
                        'default': ['']
                    };
                    const conditionTypes = conditionTypesMap[scope.param.searchType] || conditionTypesMap['default'];
                    const componentName = 'input-' + type;
                    const multi = scope.param.searchType === 'multi';
                    const template = conditionTypes.map((conditionType)=> {
                        return `
                            <${componentName} value="condition[param.name]${conditionType}" param="param"></${componentName}>
                        `;
                    }).join('');
                    const contents:any = angular.element(template);
                    $compile(contents)(scope);
                    element.html(contents);
                });
            }
        };
    });
