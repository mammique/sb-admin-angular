angular.module('sbAdminApp')
    .component('main',{
          template: `
            <div id="wrapper">
                <header></header>
                <div id="page-wrapper" style="min-height: 561px;">
                    <div ui-view></div>
                </div>
            </div>
            `
    });
