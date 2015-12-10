/*global define, amplify */

define([
    'jquery',
    'fx-ana/widgets/bridge/Bridge',
    'fx-m-c/start',
    'fx-ana/config/events',
    "amplify"
], function ($, Bridge, MapCreator, E) {

    'use strict';

    var defaultOptions = {
        interaction: "click",
        label: 'Map'
    };


    function MapPlugin(options) {

        this.mapCreator = new MapCreator();

        this.bridge = new Bridge();

        this.o = {};

        $.extend(true, this, defaultOptions, options);

        return this;
    }

    MapPlugin.prototype.renderMap = function () {

        this.mapCreator.addLayer(this.model);
        
        //TODO extract workspace,layerName by model.metadata
        //http://fenix.fao.org:20200/geoserver/uneca/wms?service=WMS&version=1.1.0&request=GetMap&layers=uneca:hydrobasins_africa_3857&styles=&bbox=-2021840.2515328003,-4141819.9120579544,6071086.72913805,4517804.763795077&width=478&height=512&srs=EPSG:3857&format=application/openlayers
        
        //console.log('addLayerByName',layerName,layerTitle,this.config.url.wms)

        //this.mapCreator.addLayerByName('uneca:hydrobasins_africa_3857','Hydrobasins');

        this.mapCreator.addCountryBoundaries();

        this.mapCreator.invalidateSize();
    };

  /*  MapPlugin.prototype.test = function (layer) {

        var self = this;
        window.setTimeout(function() {
            self.mapCreator.removeLayer(layer);

            self.mapCreator.addLayer(self.model);
        }, 2000);

    };*/

    //Mandatory
    MapPlugin.prototype.isSuitable = function () {

        var columns = this.model.metadata.dsd.columns,
            suitable = false;

        for (var i=0; i < columns.length; i ++) {

            //TODO check if the join mapping layer is available
            if (columns[i].subject === 'geo'){
                suitable = true;
                break;
            }

        }

        return suitable;
    };

    //Mandatory
    MapPlugin.prototype.show = function () {

        //this.controller.setModuleWidth( 'full' );

        if (!this.initialized) {
            this.initialized = true;
            this.initTab();
        } else {
            this.mapCreator.invalidateSize();
        }

    };

    //Mandatory
    MapPlugin.prototype.destroy = function () {

        this.initialized = false;
    };

    //Optional
    MapPlugin.prototype.get = function (attr, lang) {

        var o = this[attr];

        if (!o) {
            return '';
        }

        if (typeof o === 'object') {
            return o[lang] ? o[lang] : '';
        }

        return o;
    };

    //Optional
    MapPlugin.prototype.init = function () {

        this.mapCreator.render({
            container: this.$el,
            model: {}
        });
    };

    MapPlugin.prototype.initTab = function () {

        this.initTemplate();

        this.initVariables();

        this.bindEventListeners();

        this.initContentTab();

        this.getData();

    };

    MapPlugin.prototype.initTemplate = function () {

       /* var template = Handlebars.compile(pluginTemplate);
        var html = template({}),
            $injectMe = $(html);

        $injectMe.find(s.FILTER).hide();

        this.$el.html($injectMe);*/
    };

    MapPlugin.prototype.initVariables = function () {


    };

    MapPlugin.prototype.bindEventListeners = function () {

        var self = this;

        amplify.subscribe(E.MODULE_RESIZED, function (controllerId) {

            if (self.controller.id === controllerId) {
                self.mapCreator.invalidateSize();
            }

        });

    };

    MapPlugin.prototype.initContentTab = function () {

    };

    MapPlugin.prototype.getData = function () {

        this.bridge.getResourceData(this.model.metadata, this.controller.o.filter).then($.proxy(this.onGetResourceDataSuccess, this));
    };

    MapPlugin.prototype.onGetResourceDataSuccess = function (response) {

        this.model = response;

        this.renderMap();
    };


    return MapPlugin;

});