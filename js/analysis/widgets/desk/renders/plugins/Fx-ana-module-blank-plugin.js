/*global define, Promise, amplify */

define([
    'jquery',
    'fx-ana/widgets/bridge/Bridge',
    //'text!fx-ana/widgets/desk/renders/plugins/html/Fx-ana-module-chart-plugin-template.hbs',
    'fx-ana/config/events',
    'handlebars',
    'amplify'
], function ($, Bridge, pluginTemplate, ChartCreator, E, Handlebars) {

    'use strict';

    var defaultOptions = {
   
    }, s = {
       
    };

    function BlankPlugin(options) {

        this.bridge = new Bridge();

        this.o = {};

        $.extend(true, this, defaultOptions, options);

        return this;
    }

    BlankPlugin.prototype.initTab = function () {

        this.initTemplate();

        this.initVariables();

        this.bindEventListeners();

        this.initContentTab();

        this.getData();

    };

    BlankPlugin.prototype.initTemplate = function () {

/*        var template = Handlebars.compile(pluginTemplate);
        var html = template({}),
            $injectMe = $(html);

        $injectMe.find(s.FILTER).hide();

        this.$el.html($injectMe);*/
    };

    BlankPlugin.prototype.initVariables = function () {

    };

    BlankPlugin.prototype.bindEventListeners = function () {


    };

    BlankPlugin.prototype.getData = function () {

       // this.bridge.getResourceData(this.model.metadata, this.getFilter()).then($.proxy(this.onGetResourceDataSuccess, this));
    };

    BlankPlugin.prototype.getFilter = function () {

        return [];
    };

    BlankPlugin.prototype.onGetResourceDataSuccess = function (response) {

        this.model = response;

        this.renderTab();
    };

    BlankPlugin.prototype.renderTab = function () {

    };

    //Mandatory
    BlankPlugin.prototype.isSuitable = function () {

        return true;
    };

    //Mandatory
    BlankPlugin.prototype.show = function () {

        if (!this.initialized) {
            this.initialized = true;
            this.initTab();
        }
    };

    //Mandatory
    BlankPlugin.prototype.destroy = function () {

        this.initialized = false;
    };

    //Optional
    BlankPlugin.prototype.get = function (attr, lang) {

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
    BlankPlugin.prototype.init = function () {

        //cache original model
        this._model = $.extend(true, {}, this.model);
    };

    return BlankPlugin;

});