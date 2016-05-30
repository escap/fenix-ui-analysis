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
    'fx-catalog/start',
    'fx-v-b/start',
    'fx-common/utils',
    'handlebars',
    'fx-common/structures/fx-fluid-grid',
    'amplify',
    'bootstrap'
], function ($, _, log, ERR, EVT, C, CD, Templates, i18nLabels, Catalog, Box, Utils, Handlebars, Grid) {

    'use strict';

    var s = {
        ANALYSIS: "[data-role='analysis']",
        MODAL: "[data-role='modal']",
        CATALOG_EL: "[data-role='catalog-container']",
        CATALOG_BUTTON: "[data-action='catalog']",
        GRID: "[data-role='grid']",
        STACK: "[data-role='stack']",
        STACK_ITEM: "[data-role='stack-item']",
        STACK_ITEM_REMOVE_BUTTON: "[data-action='stack-item-remove']",
        STACK_ITEM_ENLARGE_BUTTON: "[data-action='stack-item-enlarge']",
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
        this.environment = this.initial.environment;

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

        this.$catalogButton = this.$el.find(s.CATALOG_BUTTON);
        this.$modal = this.$el.find(s.MODAL);
        this.$stack = this.$el.find(s.STACK);

        this.stackItems = [];
        this.gridItems = [];

    };

    Analysis.prototype._bindEventListeners = function () {

        var self = this;

        this.$catalogButton.on("click", _.bind(function () {
            this.$modal.modal("show");
            //this._addToStack();
        }, this));

        this.catalog.on("select", function (payload) {
            self.$modal.modal("hide");
            self._addToGrid(payload);
        });

        //amplify.subscribe(this._getEventName("select"), this, this._onSelectResult);

    };

    Analysis.prototype._initComponents = function () {

        this._initCatalog();

        this.grid = new Grid({
            $el: s.GRID
        });

    };

    Analysis.prototype._initCatalog = function () {
        var defaultSelectors = C.default_catalog_selectors || CD.default_catalog_selectors;

        this.catalog = new Catalog({
            $el: s.CATALOG_EL,
            defaultSelectors: defaultSelectors,
            //actions: ["download", 'view'],
            //baseFilter : { test : "test"}
        });

    };

    //Grid
    Analysis.prototype._addToGrid = function (obj) {

        var $blank = this.grid.getBlankContainer(),
            config = {
                el: $blank,
                uid: obj.model.uid,
                environment : this.environment
            },
            box;

        if (obj.model.version) {
            config.version = obj.model.version;
        }

        console.log(config)

        box = new Box(config);

        this._bindBoxEventListeners(box);

        this.gridItems.push(box);

        this.grid.add($blank);

    };

    Analysis.prototype._removeFromGrid = function (obj) {
        //TODO remove from list - delete this.gridItems[...]
    };

    Analysis.prototype._bindBoxEventListeners = function (Box) {

        var self = this;

        Box.on("minimize", function (payload) {
            self._addToStack(payload)
        });

        Box.on("remove", function (payload) {
            //self._addToStack(payload)
        });

    };

    //Stack
    Analysis.prototype._addToStack = function (obj) {

        var $item = this._createStackItem(obj);

        this.stackItems.push($item);

        this.$stack.append($item);

    };

    Analysis.prototype._removeFromStack = function ($item) {

        this._unbindStackItemEventListeners($item);

        $item.remove();

    };

    Analysis.prototype._createStackItem = function (obj) {

        var template = Handlebars.compile($(Templates).find(s.STACK_ITEM)[0].outerHTML),
            $html = $(template($.extend(true, {}, i18nLabels, obj)));

        this._bindStackItemEventListeners($html);

        return $html;
    };

    Analysis.prototype._bindStackItemEventListeners = function ($html) {

        $html.find(s.STACK_ITEM_REMOVE_BUTTON).on('click', _.bind(function (e) {
            var $html = $(e.target).closest(s.STACK_ITEM);
            this._removeFromStack($html);
        }, this));

        $html.find(s.STACK_ITEM_ENLARGE_BUTTON).on('click', _.bind(function (e) {

            var $html = $(e.target).closest(s.STACK_ITEM);

            this._removeFromStack($html);
            this._addToGrid()
        }, this));

    };

    Analysis.prototype._unbindStackItemEventListeners = function ($html) {

        $html.find(s.STACK_ITEM_REMOVE_BUTTON).off();
        $html.find(s.STACK_ITEM_ENLARGE_BUTTON).off();

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

        _.each(err, _.bind(function (e) {

            var $li = $("<li>" + i18nLabels[e] + "</li>");

            this.$el.find(s.ERROR_CONTAINER).show().append($li);

        }, this));
    };

    Analysis.prototype._hideError = function () {

        this.$el.find(s.ERROR_CONTAINER).hide();
    };

    Analysis.prototype._setObjState = function (key, val) {

        Utils.assign(this.state, key, val);

    };

    Analysis.prototype._getObjState = function (path) {

        return Utils.getNestedProperty(path, this.state);
    };

    return Analysis;
});