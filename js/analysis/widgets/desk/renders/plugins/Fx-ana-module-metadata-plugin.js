/*global define, Promise */

define([
    'jquery',
    'underscore',
    'FENIX_UI_METADATA_VIEWER',
    'text!fx-ana/html/widgets/desk/plugins/metadata-template.html'
], function ($, _, METADATDA, template) {

    'use strict';

    var defaultOptions = {
        interaction: "click",
        label: 'Metadata'
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
        var metadata = new METADATDA();
        metadata.init({
            data: this.model.metadata,
            lang: 'en',
            //placeholder_id: 'metadata_panel',
            placeholder : this.$el.find('.metadata_panel')
        });

    };

    //Mandatory
    MetadataPlugin.prototype.show = function () {

        if (!this.initialized){
            this.print();
            this.initialized = true;
        }

        return this;
    };

    return MetadataPlugin;
});