/*global define, Promise */

define([
    'jquery',
    'fx-ana/widgets/bridge/Bridge',
    'fx-c-c/start'
], function ($, Bridge, ChartCreator) {

    'use strict';

    var defaultOptions = {
        interaction: "click",
        label: 'Chart'
    };

    function ChartPlugin(options) {

        this.chartCreator = new ChartCreator();

        this.o = {};
        $.extend(true, this, defaultOptions, options);
        return this;
    }

    ChartPlugin.prototype.renderChart = function () {

        this.chartCreator.render({
            container: this.$el,
            model: this._model
        });
    };

    //Mandatory
    ChartPlugin.prototype.isSuitable = function () {

        return true;
    };

    //Mandatory
    ChartPlugin.prototype.show = function () {

        console.log("Chart show")
        return;

        if (!this.initialized) {
            this.renderChart();
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