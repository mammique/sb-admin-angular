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
                    if(scope.param.type === 'chain' && scope.param.forceEdittable) {
                        scope.effectiveParam = scope.param.chains.slice(-1)[0].field;
                    }else {
                        scope.effectiveParam = scope.param;
                    }
                    let type = scope.effectiveParam.elementType || scope.effectiveParam.type;
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
                    const conditionTypes = conditionTypesMap[scope.effectiveParam.searchType] || conditionTypesMap['default'];
                    const componentName = 'input-' + type;
                    const multi = scope.effectiveParam.searchType === 'multi';
                    const template = conditionTypes.map((conditionType)=> {
                        return `
                            <${componentName} value="condition[effectiveParam.name]${conditionType}" param="effectiveParam"></${componentName}>
                        `;
                    }).join('');
                    const contents:any = angular.element(template);
                    $compile(contents)(scope);
                    element.html(contents);
                });
            }
        };
    });
