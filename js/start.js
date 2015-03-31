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

    var o = {};

    function Start(options) {
        $.extend(true, o, options);
    }

    Start.prototype.init = function (options) {

        $.extend(true, o, options);

        this.pageController = new Controller();

        $.extend( this.pageController, {
            stack: this.initStack(),
            desk: this.initDesk(),
            storage: new Storage(),
            bridge : new Bridge()
        });

        this.pageController.render();

        return this;
    };

    Start.prototype.getData = function( payload, callback) {
        this.pageController.getData(payload, callback);
    };

    Start.prototype.initDesk = function () {

        var grid = new Grid().init({
            container: document.querySelector('#fx-ana-result-container'),
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

        return  $.extend(new Desk(), {
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

    Start.prototype.add = function (item) {
        var filteredData = item.filtered_data;
        this.pageController.addItemToDesk(item);
//        this.pageController.addItemToDesk(filteredData);
    };

    return Start;
});
