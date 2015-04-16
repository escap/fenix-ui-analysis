/*global define */
define([
    'jquery',
    'fx-ana/controllers/Fx-analysis-page',
    'fx-ana/widgets/storage/SessionStorage',
    'fx-ana/widgets/stack/Fx-widgets-stack',
    'fx-ana/controllers/Fx-analysis-desk',
    'fx-ana/structures/Fx-fluid-grid',
    'fx-ana/widgets/bridge/Bridge',
    'fx-ana/widgets/bridge/Bridge'
], function ($, Controller, Storage, Stack, Desk, Grid, Bridge) {

    'use strict';

    function Start(options) {

        this.o = {};

        $.extend(true, this.o, options);
    }

    Start.prototype.init = function (o) {

        var conf;

        $.extend(true, this.o, o);

        this.pageController = new Controller();

        conf = {
            host : this.o,
            desk: this.initDesk(),
            bridge : new Bridge()
        };

        //configure modules stack if active
        if (this.o.hasOwnProperty('stack') && this.o.stack.active === true) {
            conf.stack = this.initStack();
        }

        //configure session if active
        if (this.o.hasOwnProperty('session') && this.o.session.active === true) {
            conf.storage = new Storage();
        }

        $.extend( this.pageController, conf);

        this.pageController.render();

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
                columnWidth: '.fx-analysis-item',
                rowHeight: '.fx-analysis-item'
            }
        });

        return $.extend(new Desk(), {
            grid : grid
        });
    };

    Start.prototype.initStack = function () {

        return new Stack().init({
            container: "#fx-widgets-stack",
            open : '#fx-widgets-stack-btn',
            counter : '#fx-widgets-stack-counter'
        });
    };

    Start.prototype.getData = function( payload, callback) {
        this.pageController.getData(payload, callback);
    };

    Start.prototype.add = function (item) {
        this.pageController.addItemToDesk(item);
    };

    return Start;
});
