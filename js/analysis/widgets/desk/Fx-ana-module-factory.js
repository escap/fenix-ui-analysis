/*global define, amplify */

/*
 * Responsibilities:
 * Compile blank analysis module template and add callback to control buttons
 * Instantiate and render a module render according to the resource type
 *
 * */
define([
    'jquery',
    'fx-ana/widgets/desk/renders/Fx-ana-dataset',
    'text!fx-ana/html/widgets/desk/items/template.html',
    'fx-ana/config/events',
    'amplify',
    'bootstrap'
], function ($, DataSetRenderer, template, E) {

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
        }
    };

    function Factory(options) {

        this.o = {};

        $.extend(true, this.o, defaultOptions, options);

        this.renders = {};

        this.renders.DATASET = DataSetRenderer;

        this.bindEventListeners();
    }

    Factory.prototype.bindEventListeners = function () {

        var self = this;

        amplify.subscribe(E.TAB_RESIZE, function (container) {
            self.publishResizeEvent(container);
        });

        amplify.subscribe(E.TAB_SET_MODULE_WIDTH, function (container, width) {
            self.publishSetModuleWidthEvent(container, width);
        });
    };

    Factory.prototype.getRender = function (model) {

        //TODO add logic to discriminate if the resource shown is a dataset, a codelist or else
        return new this.renders.DATASET();
    };

    Factory.prototype.render = function (options) {

        var _$template = $(template),
            render = this.getRender(),
            opt = $.extend(true, {template: _$template}, options);

        this.compileTemplate(opt);

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
            style = options.style,
            self = this;

        remove.on(this.o.interaction, function () {
            amplify.publish(E.MODULE_REMOVE, options.container, options.model);
        });

        clone.on(this.o.interaction, function () {
            amplify.publish(E.MODULE_CLONE, options.model);
        });

        resize.on(this.o.interaction, function () {
            self.publishResizeEvent(options.container);
        });

        minimize.on(this.o.interaction, function () {
            amplify.publish(E.MODULE_MINIMIZE, options.container, options.model);
        });

        if (style) {

            remove.addClass(style.MODULE_CONTROL_REMOVE ? style.MODULE_CONTROL_REMOVE : '');

            clone.addClass(style.MODULE_CONTROL_CLONE ? style.MODULE_CONTROL_CLONE : '');

            resize.addClass(style.MODULE_CONTROL_RESIZE ? style.MODULE_CONTROL_RESIZE : '');

            minimize.addClass(style.MODULE_CONTROL_MINIMIZE ? style.MODULE_CONTROL_MINIMIZE : '');
        }
    };

    Factory.prototype.publishResizeEvent = function (container) {

        $(this).resize();
        $(window).trigger('resize');
        amplify.publish(E.MODULE_RESIZE, container);
    };

    Factory.prototype.publishSetModuleWidthEvent = function (container, width) {
        amplify.publish(E.MODULE_SET_WIDTH, container, width);
        $(this).resize();
        $(window).trigger('resize');
    };

    return Factory;
});