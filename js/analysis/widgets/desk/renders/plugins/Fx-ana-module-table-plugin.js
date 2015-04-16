/*global define, Promise */

define([
    'jquery',
    'jqwidgets'
], function ($) {

    'use strict';

    var defaultOptions = {
        interaction: "click",
        label: 'Table',
        o: {
            RESOURCES: 'resources',
            DSD: 'dsd',
            METADATA: 'metadata',
            COLUMNS: 'columns',
            VALUES: 'values',
            DATA: 'data',
            VIRTUAL: 'virtualColumn',
            COLUMN_ID: "subject"
        }
    };

    function TablePlugin(options) {
        this.o = {};
        $.extend(true, this, defaultOptions, options);
        return this;
    }

    TablePlugin.prototype.renderTable = function () {

        var data = this.data,
        // prepare the data
            source = {
                datatype: "json",
                datafields: this.getDataFields(),
                localdata: data
            },
            dataAdapter = new $.jqx.dataAdapter(source);

        this.$el.jqxGrid(
            {
                width: '100%',
                columnsresize: true,
                source: dataAdapter,
                columns: this.getColumns(),
                theme: "fenix"
            });

    };

    TablePlugin.prototype.getDataFields = function () {
        return this.dataFields;
    };

    TablePlugin.prototype.getColumnLabel = function (column) {

        var label = this.getLabel(column, "title");

        if (label === null) {
            if (column.hasOwnProperty("dimension") && column.dimension !== null) {
                label = this.getLabel(column.dimension, "title");
            }
        }
        return label ? label : this.o.label.UNDEFINED;
    };

    TablePlugin.prototype.getColumns = function () {

        for (var i = 0; i < this.dataFields.length; i++) {
            var c = {datafield: this.dataFields[i].name};
            c.text = this.getColumnLabel(this.visibleColumns [i]);
            c.width = ( 100 / this.dataFields.length ) + "%";
            this.columns.push(c);
        }

        return this.columns;
    };

    TablePlugin.prototype.createMapCode = function (values) {

        var map = {};
        for (var i = 0; i < values.length; i++) {
            //TODO throw error if the code is not well-formed
            map[values[i].code] = this.getLabel(values[i], 'label');
        }

        return map;
    };

    TablePlugin.prototype.getLabel = function (obj, attribute) {

        var label,
            keys;

        if (obj.hasOwnProperty(attribute) && obj.title !== null) {

            if (obj[attribute].hasOwnProperty('EN')) {
                label = obj[attribute]['EN'];
            } else {

                keys = Object.keys(obj[attribute]);

                if (keys.length > 0) {
                    label = obj[attribute][keys[0]];
                }
            }
        }

        return label;
    };

    TablePlugin.prototype.processColumn = function (index, column) {

        //The column WILL be displayed
        this.visibleColumns.push(column);

        this.dataFields.push({name: column[this.o.COLUMN_ID], type: 'string'});

        if (column.dataType === "code") {
            this.columnsCodeMapping[column[this.o.COLUMN_ID]] = this.createMapCode(column.values.codes[0].codes);
        }

    };

    TablePlugin.prototype.getData = function () {

        for (var i = 0; i < this.rawData.length; i++) {

            //clone array
            var r = this.rawData[i].slice(0);

            //remove hidden columns
            for (var j = 0; j < this.indexesToDelete.length; j++) {
                r.splice(this.indexesToDelete[j] - j, 1);
            }

            //create jQWidgets model
            var d = {};
            for (j = 0; j < this.visibleColumns.length; j++) {

                if (this.visibleColumns[j].dataType === 'code') {
                    d[this.dataFields[j].name] = r[j] + ' - ' + this.columnsCodeMapping[this.visibleColumns[j][this.o.COLUMN_ID]][r[j]];
                } else {
                    d[this.dataFields[j].name] = r[j]
                }
            }

            this.data.push(d);
        }

        return this.data;
    };

    TablePlugin.prototype.initInnerStructures = function () {

        this.dsd = this.model[this.o.METADATA][this.o.DSD];
        this.visibleColumns = [];
        this.columnsCodeMapping = {};
        this.columns = [];
        this.indexesToDelete = [];
        this.dataFields = [];
        this.rawColumns = this.dsd[this.o.COLUMNS];
        this.data = [];

        for (var i = 0; i < this.rawColumns.length; i++) {
            this.processColumn(i, this.rawColumns[i]);
        }

        this.rawData = this.model[this.o.DATA];

        this.getData();
    };

    //Mandatory
    TablePlugin.prototype.isSuitable = function () {

        return true;
    };

    //Mandatory
    TablePlugin.prototype.show = function () {

        if (!this.initialized) {

            this.renderTable();
            this.initialized = true;
        }
    };

    //Optional
    TablePlugin.prototype.get = function (attr, lang) {

        var o = this[attr];

        if (!o) {
            return '';
        }

        if (typeof o === 'object') {
            return o[lang] ? o[lang] : '';
        }

        return o;
    };

    //Optional
    TablePlugin.prototype.init = function () {

        //cache original model
        this._model = $.extend(true, {}, this.model);
        this.initInnerStructures();
    };

    return TablePlugin;

});