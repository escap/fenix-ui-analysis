/*global define */

define([
    'jquery',
    'fx-ana/widgets/desk/Fx-ana-module-factory'
], function ($, ItemsFactory) {

    var defaultOptions = {
        s: {
            EVENTS_LISTENERS: 'body',
            ITEM_CLASS : 'fx-analysis-item',
            HANDLER_CLASS: "fx-handle"
        },
        events: {
            RESIZE_ITEM: "FXDeskItemResize",
            CLONE_ITEM: 'FXDeskItemCole',
            REMOVE_ITEM: "FXDeskItemRemove",
            MINIMIZE_ITEM: "FXDeskItemMinimize"
        }
    };

    //(injected)
    DeskController.prototype.grid = undefined;

    function DeskController(options) {
        this.o = {};
        this.itemsFactory = new ItemsFactory();
        $.extend(true, this.o, defaultOptions, options);
    }

    DeskController.prototype.preValidation = function () {

        if (!this.grid) {
            throw new Error("DeskController: INVALID GRID ITEM.")
        }
    };

    DeskController.prototype.renderComponents = function () {
        this.grid.render();
    };

    DeskController.prototype.initEventListeners = function () {

        var self = this;

        $(this.o.s.EVENTS_LISTENERS)
            .on(this.o.events.RESIZE_ITEM, function (e, container) {
            self.resize(container);
        });
    };

    DeskController.prototype.render = function () {

        this.preValidation();
        this.renderComponents();
        this.initEventListeners();
    };

    /*Functions on grid items*/

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
            style : this.o.style
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

    return DeskController;
});