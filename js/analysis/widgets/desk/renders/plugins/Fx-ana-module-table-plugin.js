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

        this.bridge = new Bridge();

        this.o = {};

        $.extend(true, this, defaultOptions, options);

        return this;
    }

    TablePlugin.prototype.initTab = function () {

        this.initTemplate();

        this.initVariables();

        this.bindEventListeners();

        this.getData();

    };

    TablePlugin.prototype.initTemplate = function () {

        /*        var template = Handlebars.compile(pluginTemplate);
         var html = template({}),
         $injectMe = $(html);

         $injectMe.find(s.FILTER).hide();

         this.$el.html($injectMe);*/
    };

    TablePlugin.prototype.initVariables = function () {

    };

    TablePlugin.prototype.bindEventListeners = function () {


    };

    TablePlugin.prototype.getData = function () {

        console.log(this.controller.o.filter)

        this.bridge.getResourceData(this.model.metadata, this.controller.o.filter).then($.proxy(this.onGetResourceDataSuccess, this));
    };


    TablePlugin.prototype.onGetResourceDataSuccess = function (response) {

        console.log(response)

        this.model = response;

        this.renderTab();
    };

    TablePlugin.prototype.renderTab = function () {

        this.renderTable();

    };

    TablePlugin.prototype.renderTable = function () {

        this.tableCreator.render({
            container: this.$el,
            model:  this.model
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

        if (!this.initialized) {
            this.initialized = true;
            this.initTab();

        }
    };

    //Mandatory
    TablePlugin.prototype.destroy = function () {

        this.initialized = false;
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