/*global define, amplify*/
define([
    'jquery',
    'underscore',
    'loglevel',
    'fx-analysis/config/errors',
    'fx-analysis/config/events',
    'fx-analysis/config/config',
    'fx-analysis/config/config-default',
    'text!fx-analysis/html/analysis.hbs',
    'i18n!fx-analysis/nls/analysis',
    'handlebars',
    'amplify',
    'bootstrap'
], function ($, _, log, ERR, EVT, C, CD, Templates, i18nLabels, Handlebars) {

    'use strict';

    var s = {
        ANALYSIS: "[data-role='analysis']"
    };

    function Analysis(o) {
        log.info("FENIX analysis");
        log.info(o);

        $.extend(true, this, {initial: o}, CD, C);

        this._registerHandlebarsHelpers();

        this._parseInput();

        var valid = this._validateInput();

        log.info("Analysis has valid input? " + JSON.stringify(valid));

        if (valid === true) {

            this._attach();

            this._hideError();

            this._initVariables();

            this._initComponents();

            this._bindEventListeners();

            return this;

        } else {
            log.error("Impossible to create analysis");
            log.error(valid)
        }
    }

    /**
     * Reset the view content
     * @return {null}
     */
    Analysis.prototype.reset = function () {

        log.info("analysis reset");
    };

    /**
     * pub/sub
     * @return {Object} analysis instance
     */
    Analysis.prototype.on = function (channel, fn) {
        if (!this.channels[channel]) {
            this.channels[channel] = [];
        }
        this.channels[channel].push({context: this, callback: fn});
        return this;
    };

    /**
     * Dispose
     * @return {null}
     */
    Analysis.prototype.dispose = function () {

        //unbind event listeners
        this._unbindEventListeners();

        log.info("analysis disposed successfully");

    };

    // end API

    Analysis.prototype._trigger = function (channel) {

        if (!this.channels[channel]) {
            return false;
        }
        var args = Array.prototype.slice.call(arguments, 1);
        for (var i = 0, l = this.channels[channel].length; i < l; i++) {
            var subscription = this.channels[channel][i];
            subscription.callback.apply(subscription.context, args);
        }

        return this;
    };

    Analysis.prototype._parseInput = function () {

        this.id = this.initial.id;
        this.$el = this.initial.$el;

    };

    Analysis.prototype._validateInput = function () {

        var valid = true,
            errors = [];

        //set analysis id
        if (!this.id) {

            window.fx_analysis_id >= 0 ? window.fx_analysis_id++ : window.fx_analysis_id = 0;

            this.id = "fx-analysis-" + String(window.fx_analysis_id);

            log.warn("Impossible to find analysis id. Set auto id to: " + this.id);
        }


        if (!this.$el) {
            errors.push({code: ERR.MISSING_CONTAINER});

            log.warn("Impossible to find analysis container");
        }

        this.$el = $(this.$el);

        //Check if $el exist
        if (this.$el.length === 0) {

            errors.push({code: ERR.MISSING_CONTAINER});

            log.warn("Impossible to find box container");

        }

        return errors.length > 0 ? errors : valid;
    };

    Analysis.prototype._attach = function () {

        var template = Handlebars.compile($(Templates).find(s.ANALYSIS)[0].outerHTML),
            $html = $(template($.extend(true, {}, i18nLabels)));

        this.$el.html($html);

        log.info("template attached successfully");

    };

    Analysis.prototype._initVariables = function () {

        //pub/sub
        this.channels = {};

    };

    Analysis.prototype._bindEventListeners = function () {

        //amplify.subscribe(this._getEventName("select"), this, this._onSelectResult);

    };

    Analysis.prototype._initComponents = function () {

    };

    // Handlers

    Analysis.prototype._getEventName = function (evt, excludeId) {

        var baseEvent = EVT[evt] ? EVT[evt] : evt;

        return excludeId === true ? baseEvent : baseEvent + "." + this.id;
    };

    //disposition

    Analysis.prototype._unbindEventListeners = function () {

        //amplify.unsubscribe(this._getEventName("view"), this._onViewResult);

    };

    Analysis.prototype._registerHandlebarsHelpers = function () {

        Handlebars.registerHelper('isOpened', function (opened) {
            return opened === true ? 'in' : '';
        });

    };

    Analysis.prototype._showError = function (err) {

        _.each(err, _.bind(function ( e ) {

            var $li = $("<li>"+i18nLabels[e]+"</li>");

            this.$el.find(s.ERROR_CONTAINER).show().append($li);

        }, this));
    };

    Analysis.prototype._hideError = function () {

        this.$el.find(s.ERROR_CONTAINER).hide();
    };

    return Analysis;
});