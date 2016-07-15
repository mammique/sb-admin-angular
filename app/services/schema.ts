declare var moment;

angular.module('sbAdminApp')
    .service('Schema', class Schema {
        $promise;
        constructor($http) {
            var query = parseQuery();
            let urls;
            let sampleMode = false;
            if (query.schemas) {
                urls = decodeURIComponent(query.schemas).split(';');
                console.log(urls);
            } else {
                urls = ['./resource/sample.json', './sample.json'];
                sampleMode = true;
            }
            this.$promise = Promise.all(
                urls.map((url) => {
                    return $http.get(url).catch((e)=> {
                        if(!sampleMode) {
                            throw e;
                        }
                    });
                }))
                .then((responses) => {
                    delete this.$promise;
                    function concat(responses, fieldName = null) {
                        const array = [{}].concat(responses.map((response: any) => {
                            if (fieldName) {
                                return response.data[fieldName];
                            } else {
                                return response.data;
                            }
                        }));
                        return Object.assign.apply(Object, array);
                    }
                    function firstObject(array) {
                        for(let item of array) {
                            if(item) {
                                return item;
                            }
                        }
                    }
                    const Schema = sampleMode ? firstObject(responses).data :  ({
                        tables: concat(responses, 'tables'),
                        pages: concat(responses, 'pages'),
                        menu: concat(responses).menu,
                        common: concat(responses).common,
                    });
                    // メニューがない場合は補完する
                    Schema.menu = Schema.menu || Object.keys(Schema.pages).map((key) => {
                        return {
                            page: { pageId: key },
                            title: Schema.pages[key].title || key
                        };
                    });
                    parseSchema(Schema);
                    console.log(Schema);
                    window['Schema'] = Schema;
                    Object.assign(this, Schema);
                })
                .catch((err) => {
                    console.error(err);
                    console.error(err.stack);
                });
        }
    });

function parseQuery(): any {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    var response = {};
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        response[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    }
    return response;
}


let idCounter = 1000001;

function parseSchema(Schema) {
    function arrayToMap(array, key) {
        var map = {};
        if (!array || !Array.isArray(array)) {
            debugger;
        }
        array.forEach(function (item) {
            if (!item[key]) {
                return;
            }
            map[item[key]] = item;
        });
        return map;
    }
    const system = new class System {
        today() {
            return moment().startOf('day');
        }
        now() {
            return moment();
        }
    };

    class Menu {
        children;
        sref;
        page;
        static convert(items) {
            return items.map((item) => {
                return new Menu(item);
            });
        }
        constructor(item) {
            Object.assign(this, item);
            if (this.children) {
                this.children = Menu.convert(this.children);
            }
            this.sref = `dashboard.page(${JSON.stringify(this.page)})`;
        }
    }


    class Field {
        static fields: Field[] = [];
        static fieldDefault = {
            'integer': {
                alignment: 'right',
                format: '%,d'
            },
            'id': {
                alignment: 'right',
            }
        };
        referenceTo;
        referenceTable;
        error;
        name;
        type;
        chainReferenceField;
        chains;
        format;
        alignment = 'left';
        options;
        title;
        searchType;
        searchTypeMulti: boolean;
        elementType;
        defaultValue;
        static create(param, table, requireReference = false, requireInstance = false) {
            if (typeof param === 'string') {
                const fieldElements = param.split('.');
                const fieldName = fieldElements.slice(-1)[0];
                let tableName = fieldElements.length === 2 ? fieldElements[0] : table && table.name;
                if (!table || table.name !== tableName) {
                    table = Schema.tables[tableName];
                }
                if (!table) {
                    const errorMessage = `field ${fieldName}に対するtable${tableName}が見つかりません`;
                    console.log(errorMessage);
                    return {
                        error: errorMessage
                    };
                }
                if (!fieldName) {
                    const errorMessage = `fieldが指定されていません`;
                    console.log(errorMessage);
                    return {
                        error: errorMessage
                    };
                }
                const field = table.fieldMap && table.fieldMap[fieldName];
                if (!field) {
                    const errorMessage = `field ${fieldName}がtable${tableName}に見つかりません`;
                    console.log(errorMessage);
                    return {
                        error: errorMessage
                    };
                }
                if (requireInstance && (field.type === 'calc' || field.type === 'chain')) {
                    const errorMessage = `${field.type}フィールドは使えません`;
                    console.log(errorMessage);
                    return Object.assign(param, {
                        error: errorMessage
                    });
                }
                return field;
            } else if (param.field) {
                const base = Field.create(param.field, table, false, requireInstance);
                if (base.error) {
                    return Object.assign(param, base);
                } else {
                    return new Field(Object.assign({}, base, param), table);
                }
            } else if (!requireReference) {
                return new Field(param, table);
            } else {
                const errorMessage = `fieldが指定されていません`;
                console.log(errorMessage);
                return Object.assign(param, {
                    error: errorMessage
                });
            }
        }
        static defaultValue(fields) {
            const response = {};
            fields.forEach((field) => {
                if (field.defaultValue) {
                    response[field.name] = field.defaultValue();
                }
            });
            return response;
        }
        constructor(item, public table: Table) {
            Field.fields.push(this);
            Object.assign(this, Field.fieldDefault[item.type], item);
            if (!this.type) {
                this.error = 'typeが指定されていません';
            }
            if (item.stringify) {
                if (typeof item.stringify !== 'function') {
                    item.stringify = new Function('record', 'fields', 'system', 'return ' + item.stringify);
                }
                this.stringify = (record) => {
                    try {
                        return record && item.stringify(record, this.table.fieldMap, system);
                    } catch (e) {
                        return e.toString();
                    }
                };
            }
            if (item.defaultValue) {
                if (typeof item.defaultValue !== 'function') {
                    item.defaultValue = new Function('profile', 'system', 'return ' + item.defaultValue);
                }
                this.defaultValue = () => {
                    try {
                        const value = item.defaultValue(Schema.common.profile, system);
                        return value instanceof moment ? value.toDate(): value;
                    } catch (e) {
                        console.error(e);
                        return null;
                    }
                };
            }
            const searchTypeMatch = this.searchType && this.searchType.match(/^search-format-(.*)$/)
            if (searchTypeMatch) {
                const searchTypeConversionMap = {
                    'like1': 'exact',
                    'like2': 'suffix',
                    'like3': 'prefix',
                    'like4': 'partial',
                    'date1': 'exact',
                    'date2': 'exact',//typeをmonthにするべき
                    'date3': 'range',
                    'range': 'range',
                    'default': null,
                    'select': 'exact',
                    'radio': 'exact',// elementType = inline
                    'multiselect': 'multi',
                    'check': 'multi'// elementType = inline
                };
                this.searchType = searchTypeConversionMap[searchTypeMatch[1]];
            }
            if (!this.searchType) {
                const defaultSearchTypeMap = {
                    'string': 'partial',
                    'integer': 'exact',
                    'id': 'exact',
                    'reference': 'exact',
                    'date': 'range'
                };
                this.searchType = defaultSearchTypeMap[this.type];
            }
            if (this.options) {
                if (this.type === 'chain') {
                    this.error = 'chainとoptionsは併用できません';
                } else {
                    this.type = 'reference';
                    this.elementType = 'option';
                    this.referenceTable = new Table({
                        title: this.title + 'options',
                        primaryKey: 'id',
                        stringifyKey: 'title',
                        fields: [
                            {
                                name: 'id',
                                type: 'id',
                                title: this.title + 'options_id',
                            },
                            {
                                name: 'title',
                                type: 'string',
                                title: this.title + 'options_title',
                            },
                        ],
                        records: this.options
                    });
                }
            }
        }
        static $postLink() {
            Field.fields.forEach((field) => {
                field.$postLink();
            });
        }
        $postLink() {
            if (this.type === 'reference' && !this.referenceTable) {
                if (this.referenceTo) {
                    if (this.referenceTo.match('->')) {
                        console.log('referenceで->指定はできません', this.referenceTo, this);
                        this.error = 'referenceで->指定はできません' + this.referenceTo;
                    } else {
                        const [tableName, fieldName] = this.referenceTo.split('.');
                        this.referenceTable = Schema.tables[tableName];
                        if (!this.referenceTable) {
                            console.log('reference 参照先テーブルが見つかりません', tableName, this);
                            this.error = 'reference 参照先テーブルが見つかりません' + tableName;
                        }
                    }
                } else {
                    console.log('reference 参照先テーブルが指定されていません', this);
                    this.error = 'reference 参照先テーブルが指定されていません';
                }
            } else if (this.type === 'chain') {
                if (this.referenceTo) {
                    const chains = this.referenceTo.split('->');
                    this.chains = chains.map((chain) => {
                        const chainElement = chain.split('.');
                        let table: Table;
                        if (chainElement.length === 2) {
                            let tableName = chainElement[0];
                            table = Schema.tables[tableName];
                            if (!table) {
                                console.log(`chainで指定されたテーブル ${tableName}が見つかりません`, this.referenceTo, this);
                                this.error = `chainで指定されたテーブル ${tableName}が見つかりません`;
                            }
                        } else {
                            table = this.table;
                        }
                        const fieldName = table && chainElement.slice(-1)[0];
                        const field = table && table.fieldMap[fieldName];
                        if (table && !field) {
                            console.log(`chainで指定されたフィールド ${fieldName}が見つかりません`, this.referenceTo, this);
                            this.error = `chainで指定されたテーブル ${fieldName}が見つかりません`;
                        }
                        return {
                            table, field
                        };
                    });
                }
            }
        }
        idToItem(id) {
            if (!this.referenceTable) {
                console.log('referenceTableが定義されていません', this);
                return;
            }
            return this.referenceTable.get(id);
        }
        itemToId(value) {
            return value && value[this.referenceTable.primaryKey];
        }
        stringify(record) {
            if (this.error) {
                return this.error;
            }
            if (!record) {
                return null;
            } else if (this.type === 'date') {
                return moment(record[this.name]).format('YYYY-MM-DD');
            } else if (this.type === 'datetime') {
                return moment(record[this.name]).format('YYYY-MM-DD HH:mm:ss');
            } else if (this.type === 'reference') {
                return this.referenceTable.stringify(this.idToItem(record[this.name]));
            } else if (this.type === 'chain') {
                let currentValue = record[this.chains[0].field.name];
                let displayValue = null;
                for (const chain of this.chains.slice(1)) {
                    if (!currentValue) {
                        return '';
                    }
                    let currentRecord = chain.table.get(currentValue);
                    if (!currentRecord) {
                        return '';
                    }
                    currentValue = currentRecord[chain.field.name];
                    displayValue = chain.field.stringify(currentRecord);
                }
                return displayValue;
            } else {
                const value = record[this.name];
                if (this.format) {
                    try {
                        return this.format.format(value);
                    } catch (e) {
                        return 'フォーマットエラー' + e.toString();
                    }
                } else {
                    return value;
                }
            }
        }
    }


    class Table {
        fields;
        fieldMap;
        recordMap;
        listPage;
        recordPage;
        records = [];
        primaryKey;
        stringifyKey;
        conditionCache = {};
        static create(param) {
            if (typeof param === 'string') {
                return Schema.tables[param];
            } else if (param.table) {
                const base = Table.create(param.table);
                return new Table(Object.assign({}, base, param));
            } else {
                return new Table(param);
            }
        }

        constructor(item) {
            Object.assign(this, item);
            this.fields = this.fields.map((field) => {
                return Field.create(field, this);
            });
            this.fieldMap = arrayToMap(this.fields, 'name');
            if (this.records) {
                this.recordMap = arrayToMap(this.records, this.primaryKey || this.fields[0].name);
            } else {
                this.records = [];
                this.recordMap = {};
            }
            this.records.forEach((record) => {
                this.fields.forEach((field) => {
                    if (field.type === 'integer' || field.type === 'id') {
                        record[field.name] = parseInt(record[field.name], 10);
                    } else if (field.type === 'string') {
                        record[field.name] = '' + record[field.name];
                    } else if (field.type === 'date' || field.type === 'datetime') {
                        record[field.name] = record[field.name] && new Date(record[field.name]);
                    }
                });
            });
        }
        save(record) {
            var found = this.records.some((_record, i) => {
                if (record[this.primaryKey] === _record[this.primaryKey]) {
                    this.records[i] = record;
                    return true;
                }
            });
            if (!found) {
                record[this.primaryKey] = idCounter++;
                this.records.push(record);
            }
            this.recordMap = arrayToMap(this.records, this.primaryKey);
        }
        search(conditionString) {
            if (!conditionString) { return this.records; }
            if (!this.conditionCache[conditionString]) {
                this.conditionCache[conditionString] = getFilterFunction(JSON.parse(conditionString));
            }
            return this.records.filter(this.conditionCache[conditionString]);
        }
        get(id) {
            return this.recordMap[id];
        }
        stringify(item) {
            return this.fieldMap[this.stringifyKey || this.primaryKey].stringify(item);
        }
        $postLink() {
            this.listPage = Schema.pages[this.listPage];
            this.recordPage = Schema.pages[this.recordPage];
        }
        defaultValue() {
            return Field.defaultValue(this.fields);
        }
    }
    function convertFieldArray(table, value) {
        if (Array.isArray(value)) {
            return value.map(function (item) {
                return convertField(table, item);
            });
        } else {
            debugger;
            console.error('fieldの形式が違います', value);
        }
    }


    function convertField(table, value) {
        if (table && typeof value === 'string') {
            value = {
                field: value
            };
        }
        if (value) {
            return Field.create(value, table);
        } else {
            return value;
        }
    }
    class Page {
        static components: Page[] = [];
        type;
        table;
        fields;
        children;
        fieldGroups;
        pageActions;
        recordActions;
        searches;
        sammaries;
        static create(param) {
            if (typeof param === 'string') {
                return Schema.pages[param];
            } else if (param.page) {
                const base = Page.create(param.page);
                return new Page(Object.assign({}, base, param));
            } else {
                return new Page(param);
            }
        }
        extend(value) {
            const response = Object.create(this);
            Object.assign(response, value);
            return response;
        }
        constructor(item) {
            Object.assign(this, item);
            Page.components.push(this);
            if (item.decoration) {
                if (typeof item.decoration !== 'function') {
                    const code = Object.keys(item.decoration).map((decorationName) => {
                        return `if(${item.decoration[decorationName]}){return '${decorationName}'}`;
                    }).join('');
                    item.decoration = new Function('record', 'system', code);
                }
                this.decoration = function (record) {
                    const decorationName = item.decoration(record, system);
                    if (decorationName) {
                        return 'bg-' + decorationName;
                    } else {
                        return '';
                    }
                };
            }
            if (typeof this.table === 'string') {
                this.table = Schema.tables[this.table];
            } else if (this.table) {
                this.table = Schema.tables[this.table.name];
            } else {
                return;
            }
            if (this.fields) {
                this.fields = this.fields && convertFieldArray(this.table, this.fields);
            }
            if (this.fieldGroups && Array.isArray(this.fieldGroups)) {
                this.fields = [];
                this.fieldGroups.forEach((fieldGroup) => {
                    if (fieldGroup.fields) {
                        fieldGroup.fields = convertFieldArray(this.table, fieldGroup.fields);
                        this.fields = this.fields.concat(fieldGroup.fields);
                    }
                });
            }
            if (!this.pageActions && this.table && this.type === 'record') {
                this.pageActions = [{
                    title: '保存',
                    type: 'save'
                }];
            }
            if (!this.pageActions && this.table && this.type === 'list' && this.table.recordPage) {
                this.pageActions = [{
                    title: '新規作成',
                    page: this.table.recordPage
                }];
            }
            if (!this.recordActions && this.table && this.type === 'list' && this.table.listPage) {
                this.recordActions = [{
                    title: '編集',
                    page: this.table.recordPage
                }];
            }
            this.searches = this.searches && this.searches.length && this.searches.map((field) => {
                return Object.assign(Field.create(field, this.table, true, false), { forceEdittable: true });
            }) || null;
            this.sammaries = this.sammaries && this.sammaries.length && this.sammaries.map((field) => {
                return Object.assign(Field.create(field, this.table, true, false), { forceEdittable: true });
            }) || null;
        }
        static $postLink() {
            Page.components.forEach((component) => {
                component.$postLink();
            });
        }
        $postLink() {
            this.children = this.children && this.children.map((component) => {
                return Page.create(component);
            });
            for (const fieldName of ['pageActions', 'recordActions']) {
                if (this[fieldName]) {
                    this[fieldName].forEach((action) => {
                        action.page = action.page || action.link;//暫定対応
                        if (action.page) {
                            const convertedAction = Schema.pages[action.page];
                            if (!convertedAction) {
                                action.error = `${fieldName}で指定されたページ${action.page}が見つかりません`;
                            }
                            action.page = convertedAction;
                        }
                    });
                }
            }
        }
        decoration(record) {
            //
        }
        defaultValue() {
            return Field.defaultValue(this.fields);
        }
        defaultCondition() {
            return Field.defaultValue(this.searches);
        }
    }

    Object.getOwnPropertyNames(Schema.tables).forEach((tableName) => {
        Schema.tables[tableName].name = tableName;
        Schema.tables[tableName] = Table.create(Schema.tables[tableName]);
    });

    Object.getOwnPropertyNames(Schema.pages).forEach((pageName) => {
        Schema.pages[pageName].name = pageName;
        Schema.pages[pageName] = Page.create(Schema.pages[pageName]);
    });

    Schema.menu = Menu.convert(Schema.menu);

    Field.$postLink();
    Page.$postLink();


    Object.getOwnPropertyNames(Schema.tables).forEach((tableName) => {
        var table = Schema.tables[tableName];
        table.$postLink();
        table.fields.forEach((field) => {
            field.$postLink();
        });
    });

    function escapeRegExp(str) {
        return str.replace(/[\-\[\]\/{}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    }
    var operatorMap = {
        _$gte: function (key, value) {
            return '(o.' + key + '>=' + JSON.stringify(value) + ')';
        },
        _$gt: function (key, value) {
            return '(o.' + key + '>' + JSON.stringify(value) + ')';
        },
        _$lte: function (key, value) {
            return '(o.' + key + '<=' + JSON.stringify(value) + ')';
        },
        _$lt: function (key, value) {
            return '(o.' + key + '<' + JSON.stringify(value) + ')';
        },
        _$eq: function (key, value) {
            return '(o.' + key + '==' + JSON.stringify(value) + ')';
        },
        _$ne: function (key, value) {
            return '(o.' + key + '!=' + JSON.stringify(value) + ')';
        },
        _$in: function (key, value) {
            return '(' + JSON.stringify(value) + '.some(function(i){return i == o.' + key + '}))';
        },
        _$text: function (key, value) {
            if (value && value._$search) {
                return '(o.' + key + '&& o.' + key + '.match(new RegExp(' + JSON.stringify(escapeRegExp(value._$search)) + ')))';
            }
        },
        _$prefix: function (key, value) {
            if (value && value._$search) {
                return '(o.' + key + '&& o.' + key + '.match(new RegExp(' + JSON.stringify('^' + escapeRegExp(value._$search)) + ')))';
            }
        },
        _$suffix: function (key, value) {
            if (value && value._$search) {
                return '(o.' + key + '&& o.' + key + '.match(new RegExp(' + JSON.stringify(escapeRegExp(value._$search) + '$') + ')))';
            }
        },
    };
    function getFilterFunction(conditions) {

        var funcExp = Object.getOwnPropertyNames(conditions).map(function (key) {
            var condition = conditions[key];
            if (!condition) {
                return;
            }
            if (typeof condition !== 'object') {
                condition = {
                    _$eq: condition
                };
            }
            var keys = key === 'anyname' ? ['firstName', 'familyName', 'firstNameKana', 'familyNameKana'] : [key];
            var exp = keys.map(function (key) {
                return Object.getOwnPropertyNames(condition).map(function (operator) {
                    return condition[operator] && operatorMap[operator](key, condition[operator]);
                }).filter((item) => item).join('&&');
            }).join('||');
            return exp && ('(' + exp + ')');
        }).filter((item, index, arr) => !!item).join('&&') || 'true';
        return new Function('o', 'return ' + funcExp);

    }
};
