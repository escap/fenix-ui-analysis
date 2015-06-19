/*global define, Promise, amplify */

define([
    'jquery',
    'fx-ana/widgets/bridge/Bridge',
    'text!fx-ana/widgets/desk/renders/plugins/html/Fx-ana-module-chart-plugin-template.hbs',
    'fx-c-c/start',
    'fx-ana/config/events',
    'handlebars',
    'amplify',
    'select2'
], function ($, Bridge, pluginTemplate, ChartCreator, E, Handlebars) {

    'use strict';

    var defaultOptions = {
        interaction: "click",
        label: 'Chart',
        lang: 'EN',
        size : 'half',
        chart: {
            //model: model,
            adapter: {
                type: 'timeserie',
                xDimensions: 'time',
                yDimensions: 'um',
                valueDimensions: 'value',
                seriesDimensions: []
            }
            //template: {},
            //creator: {},
            //onReady: renderChart1
        }
    }, s = {
        FILTER: '[data-role="filter"]',
        CONTENT: '[data-role="content"]',
        FILTER_BTN: '[data-role="filter-btn"]',
        SELECT_X_AXIS: '[data-axis="x"]',
        SELECT_Y_AXIS: '[data-axis="y"]',
        SELECT_VALUE: '[data-axis="value"]',
        SELECT_AXISES: "select",
        CHART : '[data-role="chart"]'
    };

    function ChartPlugin(options) {

        this.bridge = new Bridge();

        this.o = {};

        $.extend(true, this, defaultOptions, options);

        this.chartCreator = new ChartCreator();

        return this;
    }

    ChartPlugin.prototype.initTab = function () {

        this.initTemplate();

        this.initVariables();

        this.bindEventListeners();

        this.initContentTab();

        this.getData();

    };

    ChartPlugin.prototype.initTemplate = function () {

        var template = Handlebars.compile(pluginTemplate);
        var html = template({}),
            $injectMe = $(html);

        $injectMe.find(s.FILTER).hide();

        this.$el.html($injectMe);
    };

    ChartPlugin.prototype.initVariables = function () {

        this.$filterBtn = this.$el.find(s.FILTER_BTN);
        this.$filter = this.$el.find(s.FILTER);
        this.$content = this.$el.find(s.CONTENT);
        this.$selectXAxis = this.$el.find(s.SELECT_X_AXIS);
        this.$selectYAxis = this.$el.find(s.SELECT_Y_AXIS);
        this.$selectValue = this.$el.find(s.SELECT_VALUE);
        this.$selectAxisis = this.$el.find(s.SELECT_AXISES);
        this.$chart = this.$el.find(s.CHART);

    };

    ChartPlugin.prototype.bindEventListeners = function () {

        var self = this;

        this.$filterBtn.on('click', $.proxy(this.onFilterBtnClick, this));

        this.$selectAxisis.on('change', $.proxy(this.onSelectChange, this));

        amplify.subscribe(E.MODULE_RESIZED, function (controllerId) {

            if (self.controller.id === controllerId) {
               self.hideFilterPanel();
            }

        });
    };

    ChartPlugin.prototype.getData = function () {

        console.log(this.controller.o.filter)

        this.bridge.getResourceData(this.model.metadata, this.controller.o.filter).then($.proxy(this.onGetResourceDataSuccess, this));
    };

    ChartPlugin.prototype.onGetResourceDataSuccess = function (response) {

        this.model = response;

        console.log(response)

        this.renderChart();
    };

    ChartPlugin.prototype.renderChart = function () {

        var self = this;

        var config = $.extend(true, this.chart, {
            adapter: {
                lang: this.lang,
                xDimensions: this.$selectXAxis.val(),
                yDimensions: this.$selectYAxis.val(),
                valueDimensions: this.$selectValue.val()
            },
            model: this.model,
            onReady: function (c) {

                c.render(  {
                    container: self.$chart,
                    creator: {
                        chartObj: {
                            chart: {
                                type: self.$selectXAxis.val() !== 'time' ? 'column' : 'line'
                            },
                            plotOptions: {
                                column: {
                                    stacking: 'normal'
                                }
                            }
                        }
                    }
                });
            }
        });


        this.chartCreator.init(config);
    };

    /* Event callbacks*/

    ChartPlugin.prototype.onFilterBtnClick = function () {

        if ( this.size === 'half') {

            this.showFilterPanel();

        }  else {

            this.hideFilterPanel();
        }

    };

    ChartPlugin.prototype.showFilterPanel = function() {

        this.$filter.show();

        //Important! correspondence with template
        this.$content.addClass('col-sm-6');

        this.$content.removeClass('col-sm-12');

        this.size = 'full';

        this.controller.setModuleWidth( this.size );

    };

    ChartPlugin.prototype.hideFilterPanel = function() {

        this.$filter.hide();

        //Important! correspondence with template
        this.$content.removeClass('col-sm-6');

        this.$content.addClass('col-sm-12');

        this.size = 'half';

        $(window).trigger('resize');

        //this.controller.setModuleWidth( this.size );

    };

    ChartPlugin.prototype.onSelectChange = function () {

        this.renderChart();
    };

    ChartPlugin.prototype.initContentTab = function () {

        var columns = document.createDocumentFragment(),
            _columns;

        if (this.model.metadata && this.model.metadata.dsd && this.model.metadata.dsd.columns) {

            _columns = this.model.metadata.dsd.columns;

            for (var i = 0; i < _columns.length; i++) {

                var option = document.createElement('option');
                option.value = _columns[i].subject;
                option.text = _columns[i].title[this.lang.toUpperCase()];
                columns.appendChild(option);

            }
        }

        this.$selectAxisis.append(columns);

        this.$selectXAxis.val(this.chart.adapter.xDimensions);

        this.$selectYAxis.val(this.chart.adapter.yDimensions);

        this.$selectValue.val(this.chart.adapter.valueDimensions);

        this.$selectXAxis.select2();

        this.$selectYAxis.select2();

        this.$selectValue.select2();

    };

    //Mandatory
    ChartPlugin.prototype.isSuitable = function () {

        return true;
    };

    //Mandatory
    ChartPlugin.prototype.show = function () {

        if (!this.initialized) {
            this.initialized = true;
            this.initTab();
        }
    };

    //Mandatory
    ChartPlugin.prototype.destroy = function () {

        this.initialized = false;
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