/*global define, Promise */

define(function () {

    'use strict';

    function BasePlugin() {
        return this;
    }

    BasePlugin.prototype.isSuitable = function () {

        throw new Error('Every analysis module plugin has to override the isSuitable() method');
    };

    BasePlugin.prototype.show = function () {
        throw new Error('Every analysis module plugin has to override the show() method');
    };

    BasePlugin.prototype.init = function () {
        throw new Error('Every analysis module plugin has to override the init() method');
    };

    BasePlugin.prototype.get = function (attr, lang) {

        var o = this[attr];

        if (!o) { return ''; }

        if (typeof o === 'object'){
            return o[lang] ?  o[lang] : '';
        }

        return o;
    };

    BasePlugin.prototype.extend = function(superCtor) {
        this.super_ = superCtor;
        this.prototype = Object.create(superCtor.prototype, {
            constructor: {
                value: this,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
    };

    return BasePlugin;
});