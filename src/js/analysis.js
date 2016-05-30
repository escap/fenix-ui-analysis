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
        COURTESY: "[data-role='courtesy']"
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

        this.pulsingButtonClassName = C.pulsingButtonClassName || CD.pulsingButtonClassName;

    };

    Analysis.prototype._bindEventListeners = function () {

        this.$catalogButton.on("click", _.bind(function () {
            this.$modal.modal("show");
        }, this));

        this.catalog.on("select", _.bind(function (payload) {
            this.$modal.modal("hide");
            this._addToGridFromCatalog(payload);
        }, this));

    };

    Analysis.prototype._initComponents = function () {

        this._initCatalog();

        this.grid = new Grid({
            $el: s.GRID
        });

    };

    Analysis.prototype._initCatalog = function () {

        var defaultSelectors = C.catalog_default_selectors || CD.catalog_default_selectors,
            actions = C.catalog_actions || CD.catalog_actions,
            baseFilter = C.catalog_base_filter || CD.catalog_base_filter,
            config = {
                $el: s.CATALOG_EL,
                defaultSelectors: defaultSelectors,
                actions: actions
            };

        if (baseFilter) {
            config["baseFilter"] = baseFilter;
        }

        this.catalog = new Catalog(config);

    };

    //Grid
    Analysis.prototype._addToGrid = function (obj) {

        this._checkCourtesy();

        var $blank = this.grid.getBlankContainer(),
            config = {
                el: $blank,
                uid: obj.uid,
                environment: this.environment
            },
            box;

        if (obj.version) {
            config.version = obj.version;
        }

        window.setTimeout(_.bind(function () {

            box = new Box(config);

            this._bindBoxEventListeners(box);

            this.gridItems.push({model: box, el: $blank});

            this.grid.add($blank);

        }, this), 100);

    };

    Analysis.prototype._addToGridFromCatalog = function (obj) {

        var uid = Utils.getNestedProperty("model.uid", obj),
            version = Utils.getNestedProperty("model.version", obj);

        if (!uid) {
            log.error("Impossible to find model.uid. Abort addToGrid() fn");
            return;
        }

        var config = {
            uid: uid
        };

        if (version) {
            config.version = version;
        }

        this._addToGrid(config);

    };

    Analysis.prototype._removeFromGrid = function (obj) {

        //remove item from list
        var item = this._findModelFromGrid(obj.id),
            model = item.model;

        this.gridItems = _.without(this.gridItems, model);

        this.grid.redraw();

        // hide courtesy message if it is first box
        this._checkCourtesy();

    };

    Analysis.prototype._bindBoxEventListeners = function (Box) {

        var self = this;

        Box.on("minimize", function (payload) {
            self._addToStack(payload);
            self.grid.redraw();
            self._checkCourtesy()
        });

        Box.on("remove", function (payload) {
            self._removeFromGrid(payload);
        });

        Box.on("clone", function (payload) {
            self._addToGrid(payload)
        });

        Box.on("resize", function (payload) {
            self._setBoxSize(payload)
        });

    };

    //Stack

    Analysis.prototype._addToStack = function (obj) {

        var $item = this._createStackItem(obj);

        this.stackItems.push({model: obj, el: $item});

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
            var $html = $(e.target).closest(s.STACK_ITEM),
                id = $html.attr("data-id"),
                item = this._findModelFromStack(id),
                model = item.model;

            //remove item from list
            this.stackItems = _.without(this.stackItems, model.model);

            this._removeFromStack($html);

        }, this));

        $html.find(s.STACK_ITEM_ENLARGE_BUTTON).on('click', _.bind(function (e) {

            var $html = $(e.target).closest(s.STACK_ITEM),
                id = $html.attr("data-id"),
                item = this._findModelFromStack(id),
                model = item.model;

            //remove item from list
            this.stackItems = _.without(this.stackItems, model);

            this._removeFromStack($html);

            this._addToGrid(model);

        }, this));

    };

    Analysis.prototype._setBoxSize = function (model) {

        console.log(model.id)

        var item = this._findModelFromGrid(model.id),
            $el = item.el,
            size = model.size || "";

        console.log(this.gridItems)

        if ($el.length === 0) {

            log.error("Impossible to find $el for " + model.id);
        }

        $el.attr("data-size", size);

        this.grid.redraw();

    };

    Analysis.prototype._unbindStackItemEventListeners = function ($html) {

        $html.find(s.STACK_ITEM_REMOVE_BUTTON).off();
        $html.find(s.STACK_ITEM_ENLARGE_BUTTON).off();

    };

    // courtesy

    Analysis.prototype._checkCourtesy = function () {

        if (this.gridItems.length === 0) {
            this._showCourtesy();
        }

        if (this.gridItems.length === 0) {
            this._hideCourtesy();
        }

    };

    Analysis.prototype._showCourtesy = function () {

        this.$catalogButton.removeClass(this.pulsingButtonClassName);

        this.$el.find(s.COURTESY).show();
    };

    Analysis.prototype._hideCourtesy = function () {

        this.$catalogButton.addClass(this.pulsingButtonClassName);

        this.$el.find(s.COURTESY).hide();
    };

    // utils

    Analysis.prototype._getEventName = function (evt, excludeId) {

        var baseEvent = EVT[evt] ? EVT[evt] : evt;

        return excludeId === true ? baseEvent : baseEvent + "." + this.id;
    };

    Analysis.prototype._findModelFromGrid = function (id) {
        return this._findModelFromList(this.gridItems, id);
    };

    Analysis.prototype._findModelFromStack = function (id) {
        return this._findModelFromList(this.stackItems, id);
    };

    Analysis.prototype._findModelFromList = function (list, id) {
        return _.findWhere(list, function (item) {
            return item.model === id;
        });
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