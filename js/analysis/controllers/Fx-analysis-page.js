/*global define */

define([
    'jquery',
    'text!fx-ana/html/structure.html',
    'amplify'
], function ($, structure) {


    var defaultOptions = {
        events: {

            //Desk Events
            RESIZE_ITEM: "fx.analysis.desk.resize",
            CLONE_ITEM: 'fx.analysis.desk.clone',
            REMOVE_ITEM: "fx.analysis.desk.remove",
            MINIMIZE_ITEM: "fx.analysis.desk.minimize",


            MOVE_TO_DESK: "fx.analysis.stack.move",
            REMOVE_STACK: "fx.analysis.stack.remove"

            //FILTER_OPEN_WRAPPER: "filterOpenWrapper",
            //FILTER_OPEN_WRAPPER_APP: "filterOpenWrapperApp"
        }
    }, s = {
        GRID_STRUCTURE: "[data-component='grid']",
        STACK_STRUCTURE: "[data-component='stack']"
    };

    function PageController(options) {

        this.o = {};

        $.extend(true, this.o, defaultOptions, options);
    }

    //(injected)
    PageController.prototype.desk = undefined;

    //(injected)
    PageController.prototype.stack = undefined;

    //(injected)
    PageController.prototype.storage = undefined;

    //(injected)
    PageController.prototype.bridge = undefined;

    /* Desk */

    PageController.prototype.addItemToDesk = function (item) {
        this.desk.addItem(item);
    };

    PageController.prototype.removeItemFromDesk = function (item) {
        this.desk.removeItem(item);
    };

    /* Stack */

    PageController.prototype.addItemToStack = function (item) {
        this.stack.addItem(item);
    };

    PageController.prototype.removeItemFromStack = function (item) {
        this.stack.removeItem(item);
    };

    /* Session  */

    PageController.prototype.loadSession = function () {

        this.loadDeskFromStorage();
        this.loadStackFromStorage();
    };

    PageController.prototype.saveDeskToStorage = function (model) {
        var that = this;

        this.storage.getItem(this.o.storage.CATALOG, function (item) {
            var a = JSON.parse(item) || [];
            a.push(model.resources[0].metadata.uid);
            that.storage.setItem(that.o.storage.CATALOG, JSON.stringify(a));
        });
    };

    PageController.prototype.removeDeskItemFromStorage = function (model) {

        var that = this;
        this.storage.getItem(this.o.storage.CATALOG, function (item) {
            var a = JSON.parse(item) || [];
            var index = $.inArray(model.resources[0].metadata.uid, a);
            a.splice(index, 1);
            that.storage.setItem(that.o.storage.CATALOG, JSON.stringify(a));
        });
    };

    PageController.prototype.loadDeskFromStorage = function () {
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

    PageController.prototype.saveStackToStorage = function (model) {

        var that = this;
        this.storage.getItem(this.o.storage.STACK, function (item) {
            var a = JSON.parse(item) || [];
            a.push(model.resources[0].metadata.uid);
            that.storage.setItem(that.o.storage.STACK, JSON.stringify(a));
        });
    };

    PageController.prototype.loadStackFromStorage = function () {
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

    PageController.prototype.removeStackItemFromStorage = function (model) {

        var that = this;
        this.storage.getItem(this.o.storage.STACK, function (item) {
            var a = JSON.parse(item) || [];
            var index = $.inArray(model.resources[0].metadata.uid, a);
            a.splice(index, 1);
            that.storage.setItem(that.o.storage.STACK, JSON.stringify(a));
        });
    };

    /* API */

    PageController.prototype.getData = function (resource, callback) {

        var settings = {
            resource: resource,
            success: callback
        };

        this.bridge.query(settings);
    };

    PageController.prototype.renderComponents = function () {

        this.desk.render();

        if (this.components.stack.active === true) {
            this.stack.render();
        }
    };

    PageController.prototype.bindEventListeners = function () {

        var that = this;

        amplify.subscribe(this.o.events.CLONE_ITEM, function (e, model) {

            that.addItemToDesk(model);

            if (that.components.session.active === true) {
                that.saveDeskToStorage(model);
            }
        });

        amplify.subscribe(this.o.events.REMOVE_ITEM, function (e, container, model) {

            that.removeItemFromDesk(container);

            if (that.components.session.active === true) {
                that.removeDeskItemFromStorage(model);
            }
        });

        amplify.subscribe(this.o.events.MINIMIZE_ITEM, function (e, container, model) {

            that.addItemToStack(model);
            that.removeItemFromDesk(container);

            if (that.components.session.active === true) {
                that.saveStackToStorage(model);
                that.removeDeskItemFromStorage(model);
            }
        });

        amplify.subscribe(this.o.events.MOVE_TO_DESK, function (e, model, container) {

            that.addItemToDesk(model);
            that.removeItemFromStack(container);

            if (that.components.session.active === true) {
                that.removeStackItemFromStorage(model);
                that.saveDeskToStorage(model);
            }

        });

        amplify.subscribe(this.o.events.REMOVE_STACK, function (e, model, container) {

            that.removeItemFromStack(container);
        });

       /* amplify.subscribe(this.o.events.FILTER_OPEN_WRAPPER, function (e, container, model) {

            amplify.publish(that.o.events.FILTER_OPEN_WRAPPER_APP, container, model);
            that.removeItemFromDesk(container);
            if (that.components.session.active === true) {
                //$(this).trigger(self.o.events.FILTER_OPEN_WRAPPER_APP, [container, model]);
            }
        });*/
    };

    PageController.prototype.appendHtmlStructures = function () {

        var $structure = $(structure);

        $(this.host.container).append($structure.find(s.GRID_STRUCTURE));

        if (this.components.session.active === true) {
            $(this.host.container).append($structure.find(s.STACK_STRUCTURE));
        }
    };

    PageController.prototype.preValidation = function () {

    };

    PageController.prototype.render = function () {

        this.preValidation();

        this.components = $.extend(true, {
            stack: {active: false},
            session: {active: false}
        }, this.host);

        this.appendHtmlStructures();
        this.bindEventListeners();
        this.renderComponents();

        if (this.components.session.active === true) {
            this.loadSession();
        }
    };

    return PageController;
});