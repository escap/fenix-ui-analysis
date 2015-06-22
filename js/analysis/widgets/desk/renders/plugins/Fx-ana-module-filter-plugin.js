/*global define, Promise, amplify */

define([
    'jquery',
    'fx-filter/start',
    'text!fx-ana/widgets/desk/renders/plugins/html/Fx-ana-module-filter-plugin-template.hbs',
    'fx-ana/config/events',
    'fx-ana/config/config',
    'fx-ana/config/config-default',

    'handlebars',
    'amplify'
], function ($, Filter, pluginTemplate, E, C, DC, Handlebars) {

    'use strict';

    var defaultOptions = {
        label: 'Filter'
    }, s = {
        FILTER_CONTAINER : "filter_",
        FILTER_CANDIDATE_CONTAINER : "[data-role='filter']",
        FILTER_BTN :"[data-role='filter-btn']"
    };

    function FilterPlugin(options) {

        this.o = {};

        this.filter = new Filter();

        $.extend(true, this, defaultOptions, options);

        return this;
    }

    FilterPlugin.prototype.initTab = function () {

        this.initTemplate();

        this.initVariables();

        this.bindEventListeners();

        this.initContentTab();

    };

    FilterPlugin.prototype.initTemplate = function () {

        var template = Handlebars.compile(pluginTemplate);
        var html = template({}),
            $injectMe = $(html);

        $injectMe.find(s.FILTER).hide();

        this.$el.html($injectMe);

        window.fx_dynamic_id_counter = window.fx_dynamic_id_counter > -1 ? window.fx_dynamic_id_counter++ : 0;

        this.o.FILTER_CONTAINER = s.FILTER_CONTAINER + window.fx_dynamic_id_counter;

        this.$el.find(s.FILTER_CANDIDATE_CONTAINER).attr('id', this.o.FILTER_CONTAINER);

    };

    FilterPlugin.prototype.initVariables = function () {

    };

    FilterPlugin.prototype.bindEventListeners = function () {

        this.$el.find(s.FILTER_BTN).on('click', $.proxy(this.onFilterBtnClick, this));
    };

    FilterPlugin.prototype.onFilterBtnClick = function () {

        this.controller.refresh(this.getFilter());
    };

    FilterPlugin.prototype.initContentTab = function () {

        this.filter.init({
            container: this.o.FILTER_CONTAINER ,
            plugin_prefix: C.PLUGIN_FILTER_COMPONENT_DIRECTORY || DC.PLUGIN_FILTER_COMPONENT_DIRECTORY,
            layout: 'fluidGrid'
        });

        this.filter.add(this.getConfiguration(), null);

    };

    FilterPlugin.prototype.validateModel = function () {

        if (!this.model) {
            throw new Error('Filter plugin: no model ');
        }

        if (!this.model.metadata.dsd) {
            throw new Error('Filter plugin: no model.metadata.dsd ');
        }


        if (!this.model.metadata.dsd) {
            throw new Error('Filter plugin: no model.metadata.dsd ');
        }

        if (!this.model.metadata.dsd.columns) {
            throw new Error('Filter plugin: no model.metadata.dsd.columns ');
        }
    };

    FilterPlugin.prototype.getColumnConfiguration = function (column) {

        var conf = {
            containerType:"fluidGridBaseContainer",
            title: column.title.EN,
            components : []
        }, component = {
            lang:"EN",
            title : column.title
        };

        if (column.subject === 'value') {
            return null;
        }

        component.name = column.id;

        //define filter module type
        switch (column.dataType){
            case "code" :

                component.componentType = 'tree-FENIX';

                component.component = {
                    "source": {
                        "uid": column.values.codes[0].idCodeList,
                        "version":  column.values.codes[0].version
                    }
                };

                break;
            //case "customCode" : break;
            case "date" : break;
            case "month" : break;
            case "year" :

                component.componentType = 'timeList-FENIX' ;

                component.config = {
                    "multipleselection":true,
                    "defaultsource":[]
                };

                var timeList = column.values.timeList;

                for (var i =0; i< timeList.length; i++){

                    component.config.defaultsource.push({
                        value : timeList[i],
                        label:  String(timeList[i]),
                        selected: false
                    });
                }

                break;
            case "number" : break;
            case "text" : break;
            //case "label" : break;
            case "percentage" : break;
            //case "time" : break;
            //case "periodDate" : break;
            //case "periodMonth" : break;
            //case "periodYear" : break;
            //case "periodTime" : break;
            //case "enumNumber": break;
            //case "enumString": break;
            //case "enumBool": break;
        }

        conf.components.push(component);

        return conf;

    };

    FilterPlugin.prototype.getConfiguration = function ( ) {

        this.validateModel();

        var dsd = this.model.metadata.dsd,
            columns = dsd.columns,
            configuration = [];

        for (var i = 0; i < columns.length; i++){

            var c = this.getColumnConfiguration(columns[i]);

            if ( c !== null) {
                configuration.push(c);
            }

        }

        return configuration;
    };


    FilterPlugin.prototype.getFilter = function () {

        return this.filter.getValues();
    };

    //Mandatory
    FilterPlugin.prototype.isSuitable = function () {

        return true;
    };

    //Mandatory
    FilterPlugin.prototype.show = function () {

        if (!this.initialized) {
            this.initialized = true;
            this.initTab();
        }
    };

    //Mandatory
    FilterPlugin.prototype.destroy = function () {

        this.initialized = false;
    };

    //Optional
    FilterPlugin.prototype.get = function (attr, lang) {

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
    FilterPlugin.prototype.init = function () {

        //cache original model
        this._model = $.extend(true, {}, this.model);


    };

    return FilterPlugin;

});