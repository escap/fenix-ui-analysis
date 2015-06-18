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


    FilterPlugin.prototype.getConfiguration = function () {

        var configuration =
            [{
                "containerType": "fluidGridBaseContainer",
                "title": "Container Region",
                "activeTab": "ResurceType",
                "components": [
                    {
                        "componentType": "enumeration-FENIX",
                        "lang": "EN",
                        "title": {
                            "EN": "ResurceType",
                            "ES": "ResurceType",
                            "FR": "ResurceType"
                        },
                        "name": "ResurceType",
                        "component": {
                            "source": {
                                "uid": "RepresentationType"
                            }
                        }
                    },
                    {
                        "componentType": "text-FENIX",
                        "lang": "EN",
                        "title": {
                            "EN": "Uid",
                            "DE": "Suche",
                            "ES": "Búsqueda",
                            "FR": "Recherchet"
                        },
                        "name": "Uid",
                        "component": {
                            "rendering": {
                                "placeholder": {
                                    "EN": "Uid",
                                    "DE": "uid",
                                    "ES": "uid",
                                    "FR": "uid"
                                },
                                "htmlattributes": {
                                    "className": "form-control"
                                }
                            }
                        }
                    },
                    {
                        "componentType": "tree-FENIX",
                        "lang": "EN",
                        "title": {
                            "EN": "Region",
                            "ES": "ES List",
                            "FR": "FR List"
                        },
                        "name": "Region",
                        "component": {
                            "source": {
                                "uid": "GAUL",
                                "version": "2014"
                            }
                        }
                    }
                ]
            },
                {
                    "containerType": "fluidGridBaseContainer",
                    "title": "Container Region2",
                    "activeTab": "ReferenceArea2",
                    "components": [
                        {
                            "componentType": "codes-FENIX",
                            "lang": "EN",
                            "title": {
                                "EN": "Reference Area2",
                                "ES": "Intervalo de tiempo",
                                "DE": "Zeitbereich",
                                "FR": "Intervalle de temps"
                            },
                            "name": "ReferenceArea2",
                            "component": {
                                "source": {
                                    "uid": "GAUL_ReferenceArea",
                                    "version": "1.0"
                                }
                            }
                        }
                    ]
                }
            ];

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