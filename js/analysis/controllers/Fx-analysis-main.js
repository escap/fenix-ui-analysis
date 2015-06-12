/*global define, amplify */

define([
    'jquery',
    'text!fx-ana/html/structure.html',
    'fx-ana/config/events',
    'amplify'
], function ($, structure, E) {

    'use strict';

    var defaultOptions = {
        events: {

            MOVE_TO_DESK: "fx.analysis.stack.move",
            REMOVE_STACK: "fx.analysis.stack.remove"

        }
    }, s = {
        GRID_STRUCTURE: "[data-component='grid']",
        STACK_STRUCTURE: "[data-component='stack']"
    };

    function MainController(options) {

        this.o = {};

        $.extend(true, this.o, defaultOptions, options);
    }

    //(injected)
    MainController.prototype.desk = undefined;

    //(injected)
    MainController.prototype.stack = undefined;

    //(injected)
    MainController.prototype.storage = undefined;

    //(injected)
    MainController.prototype.bridge = undefined;

    /* Desk */

    MainController.prototype.addItemToDesk = function (item) {
        this.desk.addItem(item);
    };

    MainController.prototype.removeItemFromDesk = function (item) {
        this.desk.removeItem(item);
    };

    /* Stack */

    MainController.prototype.addItemToStack = function (item) {
        this.stack.addItem(item);
    };

    MainController.prototype.removeItemFromStack = function (item) {
        this.stack.removeItem(item);
    };

    /* Session  */

    MainController.prototype.loadSession = function () {

        this.loadDeskFromStorage();

        this.loadStackFromStorage();
    };

    MainController.prototype.saveDeskToStorage = function (model) {
        var that = this;

        this.storage.getItem(this.o.storage.CATALOG, function (item) {
            var a = JSON.parse(item) || [];
            a.push(model.resources[0].metadata.uid);
            that.storage.setItem(that.o.storage.CATALOG, JSON.stringify(a));
        });
    };

    MainController.prototype.removeDeskItemFromStorage = function (model) {

        var that = this;
        this.storage.getItem(this.o.storage.CATALOG, function (item) {
            var a = JSON.parse(item) || [];
            var index = $.inArray(model.resources[0].metadata.uid, a);
            a.splice(index, 1);
            that.storage.setItem(that.o.storage.CATALOG, JSON.stringify(a));
        });
    };

    MainController.prototype.loadDeskFromStorage = function () {
        var that = this;
        this.storage.getItem(this.o.storage.CATALOG, function (items) {
            var datasets;

            if (items) {
                datasets = JSON.parse(items);
                for (var i = 0; i < datasets.length; i++) {
                    that.getData(datasets[i], $.proxy(that.addItemToDesk, that));
                }
            }
        });
    };

    MainController.prototype.saveStackToStorage = function (model) {

        var that = this;
        this.storage.getItem(this.o.storage.STACK, function (item) {
            var a = JSON.parse(item) || [];
            a.push(model.resources[0].metadata.uid);
            that.storage.setItem(that.o.storage.STACK, JSON.stringify(a));
        });
    };

    MainController.prototype.loadStackFromStorage = function () {
        var that = this;
        this.storage.getItem(this.o.storage.STACK, function (items) {
            var datasets;

            if (items) {
                datasets = JSON.parse(items);
                for (var i = 0; i < datasets.length; i++) {
                    that.getData(datasets[i], $.proxy(that.addItemToStack, that));
                }
            }
        });
    };

    MainController.prototype.removeStackItemFromStorage = function (model) {

        var that = this;
        this.storage.getItem(this.o.storage.STACK, function (item) {
            var a = JSON.parse(item) || [];
            var index = $.inArray(model.resources[0].metadata.uid, a);
            a.splice(index, 1);
            that.storage.setItem(that.o.storage.STACK, JSON.stringify(a));
        });
    };

    /* API */

    MainController.prototype.getData = function (resource, callback) {

        var settings = {
            resource: resource,
            success: callback
        };

        this.bridge.query(settings);
    };

    MainController.prototype.renderComponents = function () {

        this.desk.render();

        if (this.components.stack.active === true) {
            this.stack.render();
        }
    };

    MainController.prototype.bindEventListeners = function () {

        var that = this;

        amplify.subscribe(E.MODULE_CLONE, function ( model) {

            that.addItemToDesk(model);

            if (that.components.session.active === true) {
                that.saveDeskToStorage(model);
            }
        });

        amplify.subscribe(E.MODULE_REMOVE, function (container, model) {

            that.removeItemFromDesk(container);

            if (that.components.session.active === true) {
                that.removeDeskItemFromStorage(model);
            }
        });

        amplify.subscribe(E.MODULE_MINIMIZE, function ( container, model) {

            that.addItemToStack(model);
            that.removeItemFromDesk(container);

            if (that.components.session.active === true) {
                that.saveStackToStorage(model);
                that.removeDeskItemFromStorage(model);
            }
        });

        amplify.subscribe(E.MOVE_TO_DESK, function ( model, container) {

            that.addItemToDesk(model);
            that.removeItemFromStack(container);

            if (that.components.session.active === true) {
                that.removeStackItemFromStorage(model);
                that.saveDeskToStorage(model);
            }

        });

        amplify.subscribe(E.REMOVE_FROM_STACK, function ( model, container) {

            that.removeItemFromStack(container);
        });

        if (this.hasOwnProperty('host') && this.host.hasOwnProperty('listenToCatalog') && this.host.listenToCatalog.active === true ) {

            amplify.subscribe(this.host.listenToCatalog.event, $.proxy(function (event) {

                this.bridge.getResourceMetadata(event).then(function (metadata) {

                    amplify.publish('fx.widget.analysis.bridge.success', metadata);
                    that.addItemToDesk($.extend(true, {}, metadata));
                });


            }, this));
        }

       /* amplify.subscribe(this.o.events.FILTER_OPEN_WRAPPER, function (e, container, model) {

            amplify.publish(that.o.events.FILTER_OPEN_WRAPPER_APP, container, model);
            that.removeItemFromDesk(container);
            if (that.components.session.active === true) {
                //$(this).trigger(self.o.events.FILTER_OPEN_WRAPPER_APP, [container, model]);
            }
        });*/
    };

    MainController.prototype.appendHtmlStructures = function () {

        var $structure = $(structure);

        $(this.host.container).append($structure.find(s.GRID_STRUCTURE));

        if (this.components.session.active === true) {
            $(this.host.container).append($structure.find(s.STACK_STRUCTURE));
        }
    };

    MainController.prototype.preValidation = function () {

    };

    MainController.prototype.render = function () {

        this.preValidation();

        this.components = $.extend(true, {
            stack: { active: false },
            session: { active: false }
        }, this.host);

        this.appendHtmlStructures();

        this.bindEventListeners();

        this.renderComponents();

        if (this.components.session.active === true) {
            this.loadSession();
        }
    };

    return MainController;
});