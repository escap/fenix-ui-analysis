/*global define, amplify */

define([
    'jquery',
    'fx-ana/widgets/desk/Fx-ana-module-factory',
    'fx-ana/config/events',
    'text!fx-ana/html/widgets/desk/items/wrapper.html'
], function ($, ItemsFactory, E, Item) {

    'use strict';

    var defaultOptions = {};

    //(injected)
    DeskController.prototype.grid = undefined;

    function DeskController(options) {

        this.itemsFactory = new ItemsFactory();

        this.o = $.extend(true, {}, defaultOptions, options);
    }

    /* API */

    DeskController.prototype.addItem = function (item) {

        var $container = $(Item);

        this.grid.addItem($container.get(0));

        this.itemsFactory.render({
            container: $container.get(0),
            model: item,
            style: this.o.style
        });
    };

    DeskController.prototype.removeItem = function (item) {

        this.grid.removeItem(item);
    };

    DeskController.prototype.resize = function (item) {

        this.grid.resize(item);
    };

    DeskController.prototype.clear = function () {

        this.grid.clear();
    };

    /* end API */

    DeskController.prototype.bindEventListeners = function () {

        var self = this;

        amplify.subscribe(E.MODULE_RESIZE, function (container) {
            self.resize(container);
        });
    };

    DeskController.prototype.renderComponents = function () {

        this.grid.render();
    };

    DeskController.prototype.preValidation = function () {

        if (!this.grid) {
            throw new Error("DeskController: INVALID GRID ITEM.");
        }
    };

    DeskController.prototype.render = function () {

        this.preValidation();

        this.renderComponents();

        this.bindEventListeners();
    };

    return DeskController;
});