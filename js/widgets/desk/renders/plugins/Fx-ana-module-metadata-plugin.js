/*global define, Promise */

define([
    'jquery',
    'underscore',
    'fx-ana/config/services-default',
    'fx-ana/config/services',
    'fx-md-v/start',
    'fx-report',
    'text!fx-ana/html/widgets/desk/plugins/metadata-template.html'
], function ($, _, DS,S,METADATDA,Report, template) {

    'use strict';

    var defaultOptions = {
        interaction: "click",
        label: 'Metadata',
        BTN_EXPORT_METADATA : '.fx-md-report-btn',
        METADATA_PANEL : '.metadata_panel'
    };

    function MetadataPlugin(options) {

        $.extend(true, this, defaultOptions, options);

        return this;
    }

    //Mandatory
    MetadataPlugin.prototype.isSuitable = function () {

        var valid = true;

        if (!this.model.hasOwnProperty('metadata')) {
            valid = false;
        }

        return valid;
    };

    //Mandatory
    MetadataPlugin.prototype.destroy = function () {

        this.initialized = false;

    };

    //Optional
    MetadataPlugin.prototype.init = function () {

        //cache original model
        this._model = $.extend(true, {}, this.model);

        this.initialized = false;

        this.metadata = this.model.metadata;

    };

    //Optional
    MetadataPlugin.prototype.get = function (attr, lang) {

        var o = this[attr];

        if (!o) {
            return '';
        }

        if (typeof o === 'object') {
            return o[lang] ? o[lang] : '';
        }

        return o;
    };

    MetadataPlugin.prototype.print = function () {

        var t =  _.template(template )( { model: this.model.metadata });

        this.$el.append( t );

        /* Metadata. */
        this.$report = new Report();
        this.$report.init('metadataExport')
        var metadata = new METADATDA();
        metadata.init({
            data: this.model.metadata,
            lang: 'en',
            //placeholder_id: 'metadata_panel',
            placeholder : this.$el.find(defaultOptions.METADATA_PANEL)
        });

        this._listenToExportMetadata();

    };

    //Mandatory
    MetadataPlugin.prototype.show = function () {

        if (!this.initialized){
            this.print();
            this.initialized = true;
        }

        return this;
    };

    MetadataPlugin.prototype._listenToExportMetadata = function() {
        var fileName = this.model.metadata.title['EN'].replace(/[^a-z0-9]/gi, '_').toLowerCase();

        var self = this;
        $(defaultOptions.BTN_EXPORT_METADATA, defaultOptions.METADATA_PANEL).on('click', function(){

            var template =
                (self.model.metadata.dsd.contextSystem &&
            self.model.metadata.dsd.contextSystem === 'uneca')?
                'uneca' : 'fao';

            var payload = {
                resource: {
                    metadata : {
                        uid : self.model.metadata.uid
                    },
                    data : []
                },
                input:{
                },
                output: {
                    config:{
                        template : template,
                        lang : 'en'.toUpperCase(),
                        fileName: fileName+'.pdf'
                    }
                }
            };

            var exportUrl = S.SERVICES_BASE_ADDRESS || DS.SERVICES_BASE_ADDRESS || 'http://fenix.fao.org/d3s'
            self.$report.exportData(payload,exportUrl);

        });
    };

    return MetadataPlugin;
});