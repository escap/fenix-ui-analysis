/*global define, amplify */

define([
    'jquery',
    'fx-ana/widgets/desk/Fx-ana-module-factory',
    'fx-ana/config/events'
], function ($, ItemsFactory, E) {

    'use strict';

    var defaultOptions = {
        s: {
            ITEM_CLASS: 'fx-analysis-item',
            HANDLER_CLASS: "fx-handle"
        }
    };

    //(injected)
    DeskController.prototype.grid = undefined;

    function DeskController(options) {
        this.o = {};
        this.itemsFactory = new ItemsFactory();
        $.extend(true, this.o, defaultOptions, options);
    }

    /* API */

    DeskController.prototype.addItem = function (item) {

        var container = document.createElement('DIV'),
            handler = document.createElement('DIV'),
            content = document.createElement('DIV');

        container.className = this.o.s.ITEM_CLASS;
        handler.className = this.o.s.HANDLER_CLASS;

        container.appendChild(handler);
        container.appendChild(content);

        this.grid.addItem(container);

        this.itemsFactory.render({
            container: container,
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