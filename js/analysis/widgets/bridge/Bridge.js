/*global define, alert, console*/
define([
    'jquery',
    'fx-ana/config/services',
    'fx-ana/config/services-default',
    'q'
], function ($, S, DS, Q) {

    'use strict';

    var defaultOptions = {
        url: S.SERVICES_BASE_ADDRESS || DS.SERVICES_BASE_ADDRESS
    };

    function Bridge(opts) {

        this.o = $.extend(true, {}, defaultOptions, opts);
    }

    Bridge.prototype.getResourceData = function ( filter ) {

        var url,
            self = this;

        if (this.o.query.hasOwnProperty('model') && !this.o.query.model.hasOwnProperty('version')) {
            url = '/processes/' + this.o.query.model.uid;
        } else {
            url = '/processes/' + this.o.query.model.uid + '/' + this.o.query.model.version;
        }

        return Q.Promise(function (resolve, reject) {

            $.ajax({
                type: 'POST',
                url: self.o.url + url,
                context: this,
                contentType: 'application/json',
                data: filter, //TODO
                success: function (data, textStatus, jqXHR) {

                    if (jqXHR.status === 200) {
                        resolve(data);
                    } else {
                        reject(new Error("Status code was " + jqXHR.status));
                    }
                },
                error: reject
            });
        });
    };

    Bridge.prototype.getResourceMetadata = function (conf) {

        var url,
            self = this;

        if (!conf.hasOwnProperty('version')) {
            url = '/resources/metadata/uid/' + conf.uid;
        } else {
            url = '/resources/metadata/' + conf.uid + '/' + conf.version;
        }

        return Q.Promise(function (resolve, reject) {

            $.ajax({
                type: 'GET',
                url: self.o.url + url,
                context: this,
                contentType: 'application/json',
                success: function (data, textStatus, jqXHR) {

                    if (jqXHR.status === 200) {
                        resolve({metadata: data });
                    } else {
                        reject(new Error("Status code was " + jqXHR.status));
                    }
                },
                error: reject
            });
        });

    };

    return Bridge;
});
