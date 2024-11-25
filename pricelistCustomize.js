var globalVar1;
var globalVar2;
var globalVar3;
pimcore.registerNS("pimcore.object.search_overwritedropdown");
Ext.override(pimcore.object.search, {

    getLayout: function () {

        if (this.layout == null) {
            // check for classtypes inside of the folder if there is only one type don't display the selection
            var toolbarConfig;

            if (this.object.data.classes && typeof this.object.data.classes == "object") {

                if (this.object.data.classes.length < 1) {
                    return;
                }

                var data = [];

                if (this.object.data.general.o_type == "folder" && this.object.data.general.o_key == "Pricelist")
                {
                    var myIndex;
                    var myClassName;
                    for (i = 0; i < this.object.data.classes.length; i++) {
                        var klass = this.object.data.classes[i];
                        data.push([klass.id, klass.name, t(klass.name), klass.inheritance]);
                        if (klass.name == 'PriceListItem')
                        {
                            myIndex = i;
                            myClassName = klass.name;
                        }

                    }
                } else {
                    for (i = 0; i < this.object.data.classes.length; i++) {
                        var klass = this.object.data.classes[i];
                        data.push([klass.id, klass.name, t(klass.name), klass.inheritance]);
                    }
                }

                var classStore = new Ext.data.ArrayStore({
                    data: data,
                    sorters: 'translatedText',
                    fields: [
                        {name: 'id', type: 'string'},
                        {name: 'name', type: 'string'},
                        {name: 'translatedText', type: 'string'},
                        {name: 'inheritance', type: 'bool'}
                    ]
                });


                if (this.object.data.general.o_type == "folder" && this.object.data.general.o_key == "Pricelist")
                {
                    this.classSelector = new Ext.form.ComboBox({
                        name: "selectClass",
                        listWidth: 'auto',
                        id: 'firstDropDown',
                        store: classStore,
                        queryMode: "local",
                        valueField: 'id',
                        displayField: 'translatedText',
                        triggerAction: 'all',
                        editable: true,
                        typeAhead: true,
                        forceSelection: true,
                        value: this.object.data["selectedClass"],
                        listeners: {
                            "select": this.changeClassSelect.bind(this),
                            myEvent: function (mycomobobox) {
                                this.setValue(data[myIndex]);

                            },
                            mySecondEvent: this.functionAfterLoad.bind(this, myClassName),
                        }
                    });
                } else {
                    this.classSelector = new Ext.form.ComboBox({
                        name: "selectClass",
                        listWidth: 'auto',
                        store: classStore,
                        queryMode: "local",
                        valueField: 'id',
                        displayField: 'translatedText',
                        triggerAction: 'all',
                        editable: true,
                        typeAhead: true,
                        forceSelection: true,
                        value: this.object.data["selectedClass"],
                        listeners: {
                            "select": this.changeClassSelect.bind(this),
                        }
                    });
                }

                var states = new Ext.data.JsonStore({
                    autoDestroy: true,
                    autoLoad: true,
                    proxy: {
                        url: "/admin/webservices/pricelistoptions",
                        type: 'ajax',
                        fields: ["abbr", "name"],
                        reader: {
                            type: 'json',
                            rootProperty: "data",
                            messageProperty: 'msgError'
                        },
                    },
                })
                if (this.object.data.general.o_type == "folder" && this.object.data.general.o_key == "Pricelist") {
                    this.classSelectorNew = new Ext.form.ComboBox({
                        store: states,
                        name: "PriceList",
                        id: 'mydropdownmenu',
                        fieldLabel: "PriceList",
                        queryMode: 'local',
                        displayField: 'name',
                        valueField: 'abbr',
                        hidden: true,
                        value: '',
                        listeners: {
                            "select": this.myRandomFunction.bind(this)
                        }
                    });
                }


                if (this.object.data.classes.length > 1) {
                    if (this.object.data.general.o_type == "folder" && this.object.data.general.o_key == "Pricelist")
                    {
                        toolbarConfig = [new Ext.Toolbar.TextItem({
                                text: t("please_select_a_type")
                            }), this.classSelector, this.classSelectorNew];

                        this.classSelector.fireEvent('myEvent', this.classSelector);
                        this.classSelector.fireEvent('mySecondEvent');
                    } else
                    {
                        toolbarConfig = [new Ext.Toolbar.TextItem({
                                text: t("please_select_a_type")
                            }), this.classSelector];
                    }

                } else {
                    this.currentClass = this.object.data.classes[0].id;
                    this.setClassInheritance(this.object.data.classes[0].inheritance);
                }
            } else {
                return;
            }

            this.layout = new Ext.Panel({
                title: this.title,
                border: false,
                layout: "fit",
                iconCls: this.icon,
                items: [],
                tbar: toolbarConfig
            });

            if (this.currentClass) {
                this.layout.on("afterrender", this.setClass.bind(this, this.currentClass));
            }
        }

        return this.layout;
    },

    justAlertFunction: function ()
    {
        this.getLayout();
    },
    changeClassSelect: function (field, newValue, oldValue) {

        this.justAlertFunction();
        if (this.object.data.general.o_type == "folder" && this.object.data.general.o_key == "Pricelist")
        {
            if (newValue.data.name == "PriceListItem")
            {
                if (document.querySelector("#mydropdownmenu-inputEl"))
                {
                    document.querySelector('#mydropdownmenu').style.visibility = 'visible';
                }
                var myobj = Ext.getCmp('mydropdownmenu').setHidden(false);
                var myobj1 = Ext.getCmp('mydropdownmenu').getEl();
            } else {
                if (document.querySelector("#mydropdownmenu-inputEl"))
                {
                    document.querySelector('#mydropdownmenu').style.visibility = 'hidden';

                    Ext.getCmp('mydropdownmenu').hide();
                }


                var myobj = Ext.getCmp('mydropdownmenu').setHidden(true);
                var myobj2 = Ext.getCmp('mydropdownmenu').getEl();
            }
        }
        //else {
        //    if(Ext.getCmp('mydropdownmenu'))
        //    {
        //        var myobj = Ext.getCmp('mydropdownmenu').setHidden(true);
        //    }
        //}

        var selectedClass = newValue.data.id;
        this.class = newValue.data.name;
        if (this.object.data.general.o_type == "folder" && this.object.data.general.o_key == "Pricelist")
        {
            globalVar1 = selectedClass;
            globalVar2 = newValue.data.inheritance;
        }
        this.setClass(selectedClass);
        this.setClassInheritance(newValue.data.inheritance);
    },

    myRandomFunction: function (field, newValue, oldValue)
    {
        this.myPriceList = newValue.data.abbr;
        //this.myPriceList = newValue.data.name;
        globalVar3 = newValue.data.abbr;
        this.setClass(globalVar1);
        this.setClassInheritance(globalVar2);
    },

    functionAfterLoad: function (myClassName, field, newValue, oldValue)
    {
        this.class = myClassName;
        var firstDropDown = Ext.getCmp('firstDropDown').getValue();

        globalVar1 = firstDropDown;
        globalVar2 = false;

        if (this.object.data.general.o_type == "folder" && this.object.data.general.o_key == "Pricelist")
        {
            if (myClassName == "PriceListItem")
            {
                Ext.getCmp('mydropdownmenu').setHidden(false);
            }
        }

        this.setClass(firstDropDown);
        this.setClassInheritance(false);
    },

    setClass: function (classId) {
        this.classId = classId;
        this.settings = {};
        this.getTableDescription();
    },

    setClassInheritance: function (inheritance) {
        this.object.data.general.allowInheritance = inheritance;
    },

    getTableDescription: function () {
        Ext.Ajax.request({
            url: "/admin/object-helper/grid-get-column-config",
            params: {
                id: this.classId,
                objectId:
                        this.object.id,
                gridtype: "grid",
                gridConfigId: this.settings ? this.settings.gridConfigId : null,
                searchType: this.searchType
            },
            success: this.createGrid.bind(this, false)
        });
    },

    createGrid: function (fromConfig, response, settings, save) {

        var itemsPerPage = pimcore.helpers.grid.getDefaultPageSize(-1);

        var fields = [];

        if (response.responseText) {
            response = Ext.decode(response.responseText);

            if (response.pageSize) {
                itemsPerPage = response.pageSize;
            }

            fields = response.availableFields;
            this.gridLanguage = response.language;
            this.gridPageSize = response.pageSize;
            this.sortinfo = response.sortinfo;

            this.settings = response.settings || {};
            this.availableConfigs = response.availableConfigs;
            this.sharedConfigs = response.sharedConfigs;

            if (response.onlyDirectChildren) {
                this.onlyDirectChildren = response.onlyDirectChildren;
            }
        } else {
            itemsPerPage = this.gridPageSize;
            fields = response;
            this.settings = settings;
            this.buildColumnConfigMenu();
        }

        this.fieldObject = {};
        for (var i = 0; i < fields.length; i++) {
            this.fieldObject[fields[i].key] = fields[i];
        }

        this.cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1,
            listeners: {
                beforeedit: function (editor, context, eOpts) {
                    //need to clear cached editors of cell-editing editor in order to
                    //enable different editors per row
                    var editors = editor.editors;
                    editors.each(function (editor) {
                        if (typeof editor.column.config.getEditor !== "undefined") {
                            Ext.destroy(editor);
                            editors.remove(editor);
                        }
                    });
                }
            }
        }
        );
        // var ApplicationName = Ext.Ajax.request({
        //     async: false,
        //     url: "/webservices/getapplicationname",
        //     method: "GET",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        // });
        // ApplicationName = JSON.parse(ApplicationName.responseText);

        // get current class
        var classStore = pimcore.globalmanager.get("object_types_store");
        var klass = classStore.getById(this.classId);
        var baseParams = {
            language: this.gridLanguage,
        };
        var existingFilters;
        if (this.store) {
            existingFilters = this.store.getFilters();
            baseParams = this.store.getProxy().getExtraParams();
        }
        if(this.object.data.general.o_type == "folder" && klass.data.text == "PriceListItem"){
            var classStore = pimcore.globalmanager.get("object_types_store");
            var klass1 = classStore.getById(this.classId);
            var pricelistfilter = globalVar3;
            var gridHelper = new pimcore.object.helpers.grid(
                klass1.data.text,
                fields,
                "/webservices/PriceListItem?classId=" + this.classId + "&folderId=" + this.object.id +"&pricelistfilter=" + pricelistfilter,
                baseParams,
                false
                );
        }
        else if (this.object.data.general.o_type == "folder" && this.object.data.general.o_key == "Pricelist")
        {
            var classStore = pimcore.globalmanager.get("object_types_store");
            var klass1 = classStore.getById(globalVar1);
            var gridHelper = new pimcore.object.helpers.grid(
                    klass1.data.text,
                    fields,
                    "/webservices/pricelistfilter?classId=" + globalVar1 + "&myPriceList=" + this.myPriceList + "&folderId=" + this.object.id,
                    baseParams,
                    false
                    );
        }
        else if (this.object.data.general.o_type == "folder" && klass.data.text == "AccountToAccountGroupRelation"){
            var classStore = pimcore.globalmanager.get("object_types_store");
            var klass1 = classStore.getById(this.classId);
            var gridHelper = new pimcore.object.helpers.grid(
                klass1.data.text,
                fields,
                "/webservices/accountToAccountGroupRelation?classId=" + this.classId + "&folderId=" + this.object.id,
                baseParams,
                false
                );
        }
        // else if (this.object.data.general.o_type == "folder" && klass.data.text == "product" && ApplicationName == "S2U"){
        else if (this.object.data.general.o_type == "folder" && klass.data.text == "product"){
            var classStore = pimcore.globalmanager.get("object_types_store");
            var klass1 = classStore.getById(this.classId);
            var gridHelper = new pimcore.object.helpers.grid(
                klass1.data.text,
                fields,
                "/webservices/productgrid?classId=" + this.classId + "&folderId=" + this.object.id,
                baseParams,
                false
                );
        }
        else {
            var gridHelper = new pimcore.object.helpers.grid(
                klass.data.text,
                fields,
                Routing.generate('pimcore_admin_dataobject_dataobject_gridproxy', {classId: this.classId, folderId: this.object.id}),
                baseParams,
                false
            );
        }

        gridHelper.showSubtype = false;
        gridHelper.enableEditor = true;
        gridHelper.limit = itemsPerPage;

        this.store = gridHelper.getStore(this.noBatchColumns, this.batchAppendColumns, this.batchRemoveColumns);
        if (this.sortinfo) {
            this.store.sort(this.sortinfo.field, this.sortinfo.direction);
        }
        this.store.getProxy().setExtraParam("only_direct_children", this.onlyDirectChildren);
        this.store.setPageSize(itemsPerPage);

        if (existingFilters && fromConfig) {
            this.store.setFilters(existingFilters.items);
        }

        var gridColumns = gridHelper.getGridColumns();

        var needGridFilter = false;

        // gridfilter plugin does not load the store if there are no filter columns.
        // so if there are no filter columns, then don't add the plugin
        // however, in this case we have to load the store manually
        if (gridColumns) {
            for (let i = 0; i < gridColumns.length; i++) {
                let col = gridColumns[i];
                if (col.filter) {
                    needGridFilter = true;
                    break;
                }
            }
        }

        var plugins = [this.cellEditing];
        if (needGridFilter) {
            plugins.push('pimcore.gridfilters');
        }

        if (!needGridFilter) {
            this.store.load();
        }

        // grid
        this.grid = Ext.create('Ext.grid.Panel', {
            frame: false,
            store: this.store,
            columns: gridColumns,
            columnLines: true,
            stripeRows: true,
            bodyCls: "pimcore_editable_grid",
            border: true,
            selModel: gridHelper.getSelectionColumn(),
            trackMouseOver: true,
            loadMask: true,
            plugins: plugins,
            viewConfig: {
                forceFit: false,
                xtype: 'patchedgridview',
                enableTextSelection: true
            },
            listeners: {
                celldblclick: function (grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
                    var columnName = grid.ownerGrid.getColumns();
                    if (columnName[cellIndex].dataIndex == 'id' || columnName[cellIndex].dataIndex == 'fullpath') {
                        var data = this.store.getAt(rowIndex);
                        pimcore.helpers.openObject(data.get("id"), data.get("type"));
                    }
                }
            },
            cls: 'pimcore_object_grid_panel',
            tbar: this.getToolbar(fromConfig, save)
        });

        this.grid.on("columnmove", function () {
            this.saveColumnConfigButton.show()
        }.bind(this));
        this.grid.on("columnresize", function () {
            this.saveColumnConfigButton.show()
        }.bind(this));

        this.grid.on("rowcontextmenu", this.onRowContextmenu);

        this.grid.on("afterrender", function (grid) {
            this.updateGridHeaderContextMenu(grid);
        }.bind(this));

        this.grid.on("sortchange", function (ct, column, direction, eOpts) {
            this.sortinfo = {
                field: column.dataIndex,
                direction: direction
            };
        }.bind(this));

        // check for filter updates
        this.grid.on("filterchange", function () {
            this.filterUpdateFunction(this.grid, this.toolbarFilterInfo, this.clearFilterButton);
            if (this.object.data.general.o_type == "folder" && this.object.data.general.fullpath.indexOf('Remittance') > -1) {
                this.createRemittanceReportGrid(this.grid);
            }
        }.bind(this));

        gridHelper.applyGridEvents(this.grid);

        this.pagingtoolbar = pimcore.helpers.grid.buildDefaultPagingToolbar(this.store, {pageSize: itemsPerPage});


        if (this.object.data.general.o_type == "folder" && this.object.data.general.fullpath.indexOf('Remittance') > -1) {
            this.newPanel = new Ext.Panel({
                items: [{}, this.grid]
            });
            this.createRemittanceReportGrid(this.grid);
        } else {
            this.newPanel = this.grid;
        }
        this.editor = new Ext.Panel({
            layout: "border",
            items: [new Ext.Panel({
                    items: [this.newPanel],
                    region: "center",
                    layout: "fit",
                    bbar: this.pagingtoolbar
                })
            ]
        });

        this.layout.removeAll();
        this.layout.add(this.editor);
        this.layout.updateLayout();

        if (save) {
            if (this.settings.isShared) {
                this.settings.gridConfigId = null;
            }
            this.saveConfig(false);
        }
    },

    createRemittanceReportGrid: function (grid) {
        var mask = new Ext.LoadMask({
            msg: 'please wait',
            target: this.layout
        });
        mask.show();
        this.newPanel.remove(this.newPanel.items.items[0]);
        setTimeout(() => {
            var gridItems = grid.getStore().getData().items;
            var totalItems = gridItems.length;
            var totalAmount = 0;
            var sumInvoiceTotalAmount = 0;
            for (var i = 0; i < totalItems; i++) {
                if(gridItems[i].getData().total_amount) {
                    totalAmount = parseFloat(totalAmount) + parseFloat(gridItems[i].getData().total_amount);
                }                
                if (gridItems[i].getData().invoice_total_amount) {
                    sumInvoiceTotalAmount = parseFloat(sumInvoiceTotalAmount) + parseFloat(gridItems[i].getData().invoice_total_amount);
                }
            }
            const roundTotalAmont = (Math.round(totalAmount * 100) / 100).toFixed(2);
            const roundInvoiceAmount = (Math.round(sumInvoiceTotalAmount * 100) / 100).toFixed(2);
            var storeData = Ext.create('Ext.data.Store', {
                fields: ['totalAmount', 'invoiceTotalAmount'],
                data: [
                    {totalAmount: roundTotalAmont, invoiceTotalAmount: roundInvoiceAmount}
                ]
            });
            var totalRecords = Ext.create('Ext.grid.Panel', {
                title: 'Remittance Sum',
                store: storeData,
                style: {'paddingLeft': "20px"},
                columns: [
                    {text: 'Sum Total Amount', dataIndex: 'totalAmount', width: 250, sortable: false},
                    {text: 'Sum Invoice Total Amount', dataIndex: 'invoiceTotalAmount', width: 250, flex: 1, sortable: false}
                ],
                height: 100,
                width: 500,
                renderTo: Ext.getBody()
            });
            this.newPanel.insert(0, totalRecords);
            mask.hide();
        }, 1000);
    }

});
