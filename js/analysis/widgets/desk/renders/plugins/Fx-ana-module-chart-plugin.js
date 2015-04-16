/*global define, Promise */

define([
    'jquery',
    'fx-c-c/start'
], function ($, ChartCreator) {

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

    function ChartPlugin(options) {

        this.chartCreator = new ChartCreator();

        this.o = {};
        $.extend(true, this, defaultOptions, options);
        return this;
    }

    ChartPlugin.prototype.renderTable = function () {

        this.chartCreator.render({
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
    ChartPlugin.prototype.isSuitable = function () {

        return true;
    };

    //Mandatory
    ChartPlugin.prototype.show = function () {

        if (!this.initialized) {
            this.renderTable();
            this.initialized = true;
        }
    };

    //Optional
    ChartPlugin.prototype.get = function (attr, lang) {

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
    ChartPlugin.prototype.init = function () {

        //cache original model
        this._model = $.extend(true, {}, this.model);
    };

    return ChartPlugin;

});