/*global define, Promise */

define([
    'jquery'
], function ($) {

    'use strict';

    var defaultOptions = {
        interaction: "click",
        label: 'Metadata',
        fields: {
            'title': {
                'EN': 'Title'
            },
            'uid': {
                'EN': 'Uid'
            },
            'version': {
                'EN': 'Version'
            }
        }
    };

    function MetadataPlugin(options) {

        $.extend(true, this, defaultOptions, options);

        return this;
    }

    MetadataPlugin.prototype.isSuitable = function () {

        var valid = true;

        if (!this.model.hasOwnProperty('metadata')) {
            valid = false;
        }

        return valid;
    };

    MetadataPlugin.prototype.getModelField = function (field) {

        var _field = this.metadata,
            paths = field.split(".");

        for (var i = 0; i < paths.length; i++) {
            if (_field.hasOwnProperty(paths[i])) {
                _field = _field[paths[i]];
            }
        }

        if (typeof _field === 'object') {
            return _field[this.lang || 'EN'];
        } else {
            return _field;
        }
    };

    MetadataPlugin.prototype.appendField = function (field) {

        var $dt = $('<dt></dt>'),
            $dd = $('<dd></dd>'),
            label = this.fields[field][this.lang] || this.fields[field]['EN'];

        $dt.html(label);

        $dd.html(this.getModelField(field));

        this.$resume.append($dt);
        this.$resume.append($dd);

    };

    MetadataPlugin.prototype.init = function () {

        //cache original model
        this._model = $.extend(true, {}, this.model);

        this.initialized = false;
        this.metadata = this.model.metadata;

    };

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

        var fs = Object.keys(this.fields),
            i;

        this.$resume = $('<div/>', {
            'class': 'dl-horizontal'
        });

        this.$el.append(this.$resume);

        for (i = 0; i < fs.length; i++) {
            if (this.model.metadata.hasOwnProperty(fs[i])) {
                this.appendField(fs[i]);
            }
        }
    };

    MetadataPlugin.prototype.show = function () {

        if (!this.initialized){
            this.print();
            this.initialized = true;
        }

        return this;
    };

    return MetadataPlugin;
});