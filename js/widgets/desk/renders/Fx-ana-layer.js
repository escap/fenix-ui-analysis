/*global define, amplify, select2 */

/*
 * Responsibilities:
 * Handle plugins life cycle
 * Handle tabs routing
 * pub/sub for tabs' communication
 *
 * */

define([
    'require',
    'jquery',
    'fx-ana/config/events',
    'fx-ana/widgets/bridge/Bridge',
    'amplify',
    'bootstrap'
], function (require, $, E, Bridge) {

    'use strict';

    var defaultOptions = {
        interaction: "click",
        plugin_registry: {
            'metadata': {
                path: 'fx-ana/widgets/desk/renders/plugins/Fx-ana-module-metadata-plugin'
            },
            'map': {
                path: 'fx-ana/widgets/desk/renders/plugins/Fx-ana-module-map-plugin'
            }
        },
        filter: [],
        tabs: {
            'map': {type: 'simple', callback: 'always'},
            'metadata': {type: 'simple', callback: 'always'},            
            //'chart': {type: 'simple', callback: 'always'},
            //'filter': {type: 'simple', callback: 'always'}
        },
        //tabs: { 'metadata' : { type: 'simple', callback: 'once'},  'table' : { type: 'simple', callback: 'once'}, dropdown : {type:'dropdown', label : {'EN' : 'my Drop'}}},
        initialTab: 'map',
        s: {
            CONTENT: '[data-role="fx-module-content"]',
            TABS: '[data-role="fx-module-tabs"]',
            DATASET_DETAILS: '.fx-dataset-details'
        }
    };

    function DS(options) {

        this.o = $.extend(true, {}, defaultOptions, options);

        this.id = this.o.id;

        this.o.plugin_instances = {};

        this.channels = {};

        this.bridge = new Bridge();
    }

    /* pub/sub for tabs' communication */
    DS.prototype.subscribe = function (channel, fn) {
        if (!this.channels[channel]) {
            this.channels[channel] = [];
        }
        this.channels[channel].push({context: this, callback: fn});
        return this;
    };

    DS.prototype.publish = function (channel) {
        if (!this.channels[channel]) {
            return false;
        }
        var args = Array.prototype.slice.call(arguments, 1);
        for (var i = 0, l = this.channels[channel].length; i < l; i++) {
            var subscription = this.channels[channel][i];
            subscription.callback.apply(subscription.context, args);
        }
        return this;
    };

    DS.prototype.showTab = function (plugin) {

        if (this.o.tabs[plugin].initialized === true) {
            return;
        }

        if (this.o.tabs[plugin].callback === 'once') {
            this.o.tabs[plugin].initialized = true;
        }

        this.o.plugin_instances[plugin].show();

    };

    DS.prototype.showInitialTab = function () {

        var initial = this.o.initialTab;

        this.o.template.find(this.o.s.TABS).find('[data-plugin="' + initial + '"] > a').tab('show');

    };

    DS.prototype.initTabSystem = function () {

        //Init bootstrap tab component
        this.o.template.find('UL').tab();

        this.bindEventListeners();

        this.showInitialTab();
    };

    /* API for tabs */

    DS.prototype.resize = function (silent) {

        amplify.publish(E.TAB_RESIZE, this.o.container, this.o.id, silent);
    };

    DS.prototype.setModuleWidth = function (width, silent) {

        amplify.publish(E.TAB_SET_MODULE_WIDTH, this.o.container, width, this.o.id, silent);
    };

    /* fn Openers */

    DS.prototype.addSimpleTabOpener = function (plugin, index, controller) {

        var $plugin_container = $('<li></li>',
                {
                    role: "presentation",
                    'data-plugin': plugin
                }),
            $a = $('<a></a>',
                {
                    href: "#fx-tab-" + plugin + "-" + index,
                    'aria-controls': plugin,
                    role: "tab",
                    'data-toggle': "tab"
                });

        if (controller.get) {

            // Set title
            $a.html(controller.get('label', this.o.lang || 'EN'));
            // Set custom css class
            $a.addClass(controller.get('style'));
        }

        return $plugin_container.append($a);

    };

    DS.prototype.addDropdownTabOpener = function (plugin, index) {

        var dropdown = this.o.tabs[plugin],
            children = dropdown.children || [],
            $plugin_container = $('<li></li>',
                {
                    role: "presentation",
                    'class': 'dropdown'
                }),
            $a = $('<a></a>',
                {
                    id: "#fx-dropdown-" + plugin + "-" + index,
                    'aria-controls': plugin,
                    'class': "dropdown-toggle",
                    'data-toggle': "dropdown"
                }),
            $ul = $('<ul></ul>', {
                'class': "dropdown-menu",
                role: "menu"
            });

        $a.html(dropdown.label[this.o.lang || 'EN'] + '<span class="caret"></span>');
        //$a.addClass(controller.get('style'));

        $plugin_container.append($a).append($ul);

        for (var i = 0; i < children.length; i++) {
            this.createOpener(children[i], $ul);
        }

        return $plugin_container;

    };

    DS.prototype.createOpener = function (tab, $container) {

        var $plugin,
            requiredPlugin;

        if (window.fx_dynamic_id_counter > -1) {
            window.fx_dynamic_id_counter++;
        } else {
            window.fx_dynamic_id_counter = 0;
        }

        if (this.o.tabs[tab].type === 'simple') {

            requiredPlugin = this.getPluginInstance(tab, window.fx_dynamic_id_counter);

            if (requiredPlugin.isSuitable) {

                if (requiredPlugin.isSuitable()) {

                    if (requiredPlugin.init) {
                        requiredPlugin.init();
                    }

                    $plugin = this.addSimpleTabOpener(tab, window.fx_dynamic_id_counter, requiredPlugin);

                } else {

                    //rollback of the plugin creation
                    this.removeTabContent(tab, window.fx_dynamic_id_counter);
                    this.removePluginInstance(tab);
                }

            } else {
                throw new Error(tab + ' has to implement the isSuitable() method');
            }

        } else {
            $plugin = this.addDropdownTabOpener(tab, window.fx_dynamic_id_counter);
        }

        $container.append($plugin);
    };

    /* end fn Openers */

    DS.prototype.addTabContent = function (plugin, index) {

        var $plugin_container = $('<div></div>', {
            id: "fx-tab-" + plugin + "-" + index,
            role: "tabpanel",
            'class': "tab-pane",
            'data-plugin': plugin
        });

        this.o.template.find(this.o.s.CONTENT).append($plugin_container);

        return $plugin_container;
    };

    DS.prototype.removeTabContent = function (plugin, index) {

        this.o.template.find(this.o.s.CONTENT).find("div#fx-tab-" + plugin + "-" + index).remove();
    };

    DS.prototype.onPluginsLoadSuccess = function () {

        this.renderTabs();
    };

    DS.prototype.renderTabs = function () {

        var self = this;

        this.o.template.addClass('loading');

        this.bridge.getResourceMetadata(this.o.resource).then(function (metadata) {

            self.o.template.removeClass('loading');

            amplify.publish('fx.widget.analysis.bridge.success', metadata);

            self.o.model = metadata;

            var tabs = Object.keys(self.o.tabs);

            for (var i = 0; i < tabs.length; i++) {
                self.createOpener(tabs[i], self.o.template.find(self.o.s.TABS));
            }

            self.initDatasetDetails();

            //sync call
            self.initTabSystem();

        });
    };

    DS.prototype.initDatasetDetails = function () {

        $(this.o.container).find(this.o.s.DATASET_DETAILS).html(this.o.model.metadata.title.EN);

    };


    DS.prototype.getPluginInstance = function (plugin, index) {

        var registry = this.o.plugin_registry,
        //Note that for sync call the argument of require() is not an array but a string
            RequiredPlugin = require(registry[plugin].path);
        
        //cache the plugin instance
        this.o.plugin_instances[plugin] = new RequiredPlugin({
            $el: this.addTabContent(plugin, index),
            controller: this,
            index: index,
            model: $.extend(true, {}, this.o.model)
        });

        return this.o.plugin_instances[plugin];

    };

    DS.prototype.removePluginInstance = function (plugin) {

        delete this.o.plugin_instances[plugin];
    };

    DS.prototype.loadPlugins = function () {

        var plugins = $.extend(true, this.o.plugin_registry, this.o.plugins || {}),
        //Load just the js of desired tabs
            keys = Object.keys(this.o.tabs),
            paths = [];

        for (var i = 0; i < keys.length; i++) {
            if (!plugins[keys[i]]) {
                throw new Error('Please register "' + keys[i] + '" analysis plugin before to use it.');
            }

            if (plugins[keys[i]].path) {
                paths.push(plugins[keys[i]].path);
            } else {
                throw new Error('Impossible to load "' + keys[i] + '" analysis plugin. Please specify a path.');
            }
        }

        //Async load of plugin js source
        require(paths, $.proxy(this.onPluginsLoadSuccess, this));

    };

    DS.prototype.bindEventListeners = function () {

        var self = this,
            $tabs = this.o.template.find(this.o.s.TABS).find('a[data-toggle="tab"]');

        $tabs.off('shown.bs.tab');

        $tabs.on('shown.bs.tab', function (e) {

            var tab = e.target; // newly activated tab
            //e.relatedTarget   // previous active tab

            self.o.currentTab = tab;

            self.showTab($(tab).parent().attr('data-plugin'));
        });

    };

    DS.prototype.render = function (options) {

        $.extend(true, this.o, options);

        this.loadPlugins();

    };

    DS.prototype.destroyTabs = function () {

        //remove openers
        this.o.template.find(this.o.s.TABS).children('[data-plugin]').remove();

        //remove tab contents but not filter
        this.o.template.find(this.o.s.CONTENT).children('[data-plugin]').remove();

        //destroy plugins but not filter
        var ps = Object.keys(this.o.plugin_instances);

        for (var i = 0; i < ps.length; i++) {
            if (this.o.plugin_instances.hasOwnProperty(ps[i])) {
                this.o.plugin_instances[ps[i]].destroy();
                this.o.tabs[ps[i]].initialized = false;
            }
        }

    };

    DS.prototype.refresh = function (filter) {

        if (filter) {

            this.o.filter = [
                {
                    "name": "simpleFilter",
                    "parameters": {
                        "filter": {
                            "rows": filter
                        }
                    }
                }
            ];

        } else {

            this.o.filter = [ ];
        }

        this.destroyTabs();

        this.renderTabs();
    };

    return DS;
});