/*global define, Promise */

define([
    'jquery',
    'underscore',
    'config/Config',
    'FENIX_UI_METADATA_VIEWER',
    'fx-report',
    'text!fx-ana/html/widgets/desk/plugins/metadata-template.html'
], function ($, _, C,METADATDA,Report, template) {

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

            var payload = {
                input:{
                    config:{
                        uid: self.model.metadata.uid
                    }
                },
                output: {
                    config:{
                        lang : 'en'.toUpperCase(),
                        fileName: fileName+'.pdf'
                    }
                }
            };

            self.$report.exportData(payload,C.MD_EXPORT_URL);
        });
    };

    return MetadataPlugin;
});