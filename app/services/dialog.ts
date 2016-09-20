angular.module('sbAdminApp')
    .service('Dialog', class Dialog{
        constructor(private $uibModal) {
        }
        openWindow(param, value) {
            const template = `
                <div class="modal-close-button-wrapper">
                    <button ng-click="$dismiss()" class="modal-close-button">
                        <span class="fa fa-times"></span>
                    </button>
                </div>
                
                <div class="modal-pane">
                    <div class="row">
                        <div class="col-lg-12">
                            <h1 class="page-header">{{$ctrl.param.title || $ctrl.param.table.title}}</h1>
                        </div>
                        <!-- /.col-lg-12 -->
                    </div>
                    <!-- /.row -->
                    <div class="row">
                        <div class="col-lg-12">
                            <page-element value="$ctrl.value" param="$ctrl.param" on-close="$ctrl.onClose(result)"></page-element>
                        </div>
                        <!-- /.col-lg-12 -->
                    </div>
                </div>
            `;
            console.log('openWidow with parameter', value, param)
            var modal = this.$uibModal.open({
                animation: true,
                template: template,
                bindToController: true,
                controllerAs: '$ctrl',
                controller: class openWindow{
                    value = value;
                    param = param;
                    onClose(result) {
                        modal.close(result);
                    }
                },
                size: 'wd',
                appendToLast: true,
            });
            return modal.result;
        }
        openPreviewWindow(title, obj) {
            const template = `
                <div class="modal-close-button-wrapper">
                    <button ng-click="$dismiss()" class="modal-close-button">
                        <span class="fa fa-times"></span>
                    </button>
                </div>
                
                <div class="modal-pane">
                    <div class="row">
                        <div class="col-lg-12">
                            <h1 class="page-header">{{$ctrl.title}}</h1>
                        </div>
                        <!-- /.col-lg-12 -->
                    </div>
                    <!-- /.row -->
                    <div class="row">
                        <div class="col-lg-12">
                            <textarea ng-model="$ctrl.value" style="width:100%;height:400px"></textarea>
                        </div>
                        <!-- /.col-lg-12 -->
                    </div>
                </div>
            `;
            var modal = this.$uibModal.open({
                animation: true,
                template: template,
                bindToController: true,
                controllerAs: '$ctrl',
                controller: class openWindow{
                    title = title;
                    value = JSON.stringify(obj, null, "  ");
                    onClose(result) {
                        modal.close(result);
                    }
                },
                size: 'wd',
                appendToLast: true,
            });
            return modal.result;
        }
        openDialogWithPreset(id) {
            var options = {
                leave: {
                    title: '確認',
                    message: '編集中のアイテムは保存されていません。保存するか、破棄するか選んでください',
                    actions: [
                        {caption: 'キャンセル', color: 'default'},
                        {caption: '破棄', color: 'warning', result: 'discard'},
                        {caption: '保存', color: 'primary', result: 'ok'}
                    ]
                },
                save: {
                    title: '確認',
                    message: '保存しますか？',
                    actions: [
                        {caption: 'キャンセル', color: 'default'},
                        {caption: 'ok', color: 'primary', result: 'ok'}
                    ]
                },
                discard: {
                    title: '確認',
                    message: '本当に破棄しますか？',
                    actions: [
                        {caption: 'キャンセル', color: 'default'},
                        {caption: '破棄', color: 'warning', result: 'discard'},
                    ]

                }
            };
            return this.openDialog(options[id]);
        }
        openDialog(options) {

            const template = `
                <div class="modal-header">
                    <h3 class="modal-title">{{$ctrl.title}}</h3>
                </div>
                <div class="modal-body">
                  {{ $ctrl.message}}</b>
                </div>
                <div class="modal-footer">
                    <button ng-repeat="action in $ctrl.actions" 
                            class="btn btn-{{action.color}}" 
                            type="button"
                            ng-click="$ctrl.select($index)">{{action.caption}}</button>
                </div>
            `;
            const modal = this.$uibModal.open({
                animation: true,
                template: template,
                bindToController: true,
                controllerAs: '$ctrl',
                controller: class openDialog{
                    actions = options.actions;
                    title = options.title;
                    message = options.message;
                    select(index) {
                        if(this.actions[index].result) {
                            modal.close(this.actions[index].result);
                        }else {
                            modal.dismiss();
                        }
                    }
                },
                size: 'sm',
                appendToLast: true,
            });
            return modal.result;
        }
    });
