/*global define, Promise */

define([
    'jquery',
    'fx-ana/widgets/bridge/Bridge',
    'fx-t-c/start'
], function ($, Bridge, TableCreator) {

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

        this.tableCreator = new TableCreator();

        this.o = {};
        $.extend(true, this, defaultOptions, options);
        return this;
    }

    TablePlugin.prototype.renderTable = function () {

        this.tableCreator.render({
            container: this.$el,
            model:  this._model
            /*
             if you want to override the default configuration,
             options: {
             sortable: true
             }
             */

        });
    };

    //Mandatory
    TablePlugin.prototype.isSuitable = function () {

        return true;
    };

    //Mandatory
    TablePlugin.prototype.show = function () {

        console.log("Table show")
        return;

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
    };

    return TablePlugin;

});