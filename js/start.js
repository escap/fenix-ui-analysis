/*global define */
define([
    'jquery',
    'fx-ana/controllers/Fx-analysis-main',
    'fx-ana/widgets/storage/SessionStorage',
    'fx-ana/widgets/stack/Fx-widgets-stack',
    'fx-ana/controllers/Fx-analysis-desk',
    'fx-common/structures/fx-fluid-grid'
], function ($, Controller, Storage, Stack, Desk, Grid) {

    'use strict';

    function Start(options) {

        this.o = $.extend(true, {}, options);
    }

    Start.prototype.init = function (o) {

        var conf;

        $.extend(true, this.o, o);

        this.mainController = new Controller();

        conf = {
            host: this.o,
            desk: this.initDesk()
        };

        //configure modules stack if active
        if (this.o.hasOwnProperty('stack') && this.o.stack.active === true) {
            conf.stack = this.initStack();
        }

        //configure session if active
        if (this.o.hasOwnProperty('session') && this.o.session.active === true) {
            conf.storage = new Storage();
        }

        $.extend(this.mainController, conf);

        this.mainController.render();

        return this;
    };

    Start.prototype.initDesk = function () {

        var grid = new Grid().init({
            container: '#fx-ana-result-container',
            drag: {
                handle: '.fx-handle',
                containment: '#fx-ana-result-container'
            },
            config: {
                itemSelector: '.fx-analysis-item',
                percentPosition: true,
                "columnWidth": '.grid-sizer',
                rowHeight: '.fx-analysis-item'
            }
        });

        return $.extend(new Desk(), {
            grid: grid
        });
    };

    Start.prototype.initStack = function () {

        return new Stack().init({
            container: "#fx-widgets-stack",
            open: '#fx-widgets-stack-btn',
            counter: '#fx-widgets-stack-counter'
        });
    };

    Start.prototype.getData = function (payload, callback) {
        //this.mainController.getData(payload, callback);
    };

    Start.prototype.add = function (item) {
        this.mainController.addItemToDesk(item);
    };

    return Start;
});
