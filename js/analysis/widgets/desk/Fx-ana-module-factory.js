/*global define */

/*
 * Responsibilities:
 * Compile blank analysis module template and add callback to control buttons
 * Instantiate and render a module render according to the resource type
 *
 * */


/*
* Custom css class
* style.MODULE_CONTROL_REMOVE
* style.MODULE_CONTROL_CLONE
* style.MODULE_CONTROL_RESIZE
* style.MODULE_CONTROL_MINIMIZE
* */

 define([
    'jquery',
    'fx-ana/widgets/desk/renders/Fx-ana-dataset',
    'text!fx-ana/html/widgets/desk/items/template.html',
    'bootstrap'
], function ($, DataSetRenderer, template) {

    'use strict';

    var defaultOptions = {
        interaction: "click",
        selectors: {
            buttons: {
                MINIMIZE: "[data-control='minimize']",
                RESIZE: "[data-control='resize']",
                CLONE: "[data-control='clone']",
                REMOVE: "[data-control='remove']"
            }
        },
        events: {
            RESIZE_ITEM: "FXDeskItemResize",
            CLONE_ITEM: 'FXDeskItemCole',
            REMOVE_ITEM: "FXDeskItemRemove",
            MINIMIZE_ITEM: "FXDeskItemMinimize"
        }
    };

    function Factory(options) {

        this.o = {};

        $.extend(true, this.o, defaultOptions, options);

        this.renders = {};
        this.renders.DATASET = new DataSetRenderer();
    }

    Factory.prototype.getRender = function (model) {

        //TODO add logic to discriminate if the resource shown is a dataset, a codelist or else
        return this.renders.DATASET;
    };

    Factory.prototype.render = function (options) {

        var _$template = $(template),
            render = this.getRender(),
            opt = $.extend({template: _$template}, options);

        this.compileTemplate(opt);

        console.log("Factory.js#render")
        console.log(options)

        render.render(opt);
    };

    Factory.prototype.compileTemplate = function (options) {

        $(options.container).append(options.template);

        this.initButtons(options);
    };

    Factory.prototype.initButtons = function (options) {

        var remove = options.template.find(this.o.selectors.buttons.REMOVE),
            clone = options.template.find(this.o.selectors.buttons.CLONE),
            resize = options.template.find(this.o.selectors.buttons.RESIZE),
            minimize = options.template.find(this.o.selectors.buttons.MINIMIZE),
            style = options.style;

        remove.on(this.o.interaction, {self: this}, function (e) {
            $(this).trigger(e.data.self.o.events.REMOVE_ITEM, [options.container, options.model]);
        });

        clone.on(this.o.interaction, {self: this}, function (e) {
            $(this).trigger(e.data.self.o.events.CLONE_ITEM, [options.model]);
        });

        resize.on(this.o.interaction, {self: this}, function (e) {
            $(this).trigger(e.data.self.o.events.RESIZE_ITEM, [options.container]);
            $(this).resize();
            $(window).trigger('resize');
        });

        minimize.on(this.o.interaction, {self: this}, function (e) {
            $(this).trigger(e.data.self.o.events.MINIMIZE_ITEM, [options.container, options.model]);
        });

        if (style) {

            remove.addClass(style.MODULE_CONTROL_REMOVE ? style.MODULE_CONTROL_REMOVE : '');

            clone.addClass(style.MODULE_CONTROL_CLONE ? style.MODULE_CONTROL_CLONE : '');

            resize.addClass(style.MODULE_CONTROL_RESIZE ? style.MODULE_CONTROL_RESIZE : '');

            minimize.addClass(style.MODULE_CONTROL_MINIMIZE ? style.MODULE_CONTROL_MINIMIZE : '');
        }
    };

    return Factory;
});