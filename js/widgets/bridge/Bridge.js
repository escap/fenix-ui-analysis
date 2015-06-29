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

    Bridge.prototype.getResourceData = function ( conf, filter ) {

        var url,
            self = this;

        if (!conf.hasOwnProperty('version')) {
            url = '/processes/' + conf.uid;
        } else {
            url = '/processes/' + conf.uid + '/' + conf.version;
        }

        return Q.Promise(function (resolve, reject) {

            $.ajax({
                type: 'POST',
                url: self.o.url + url + '?language=EN',
                context: this,
                contentType: 'application/json',
                data: JSON.stringify(filter),
                success: function (data, textStatus, jqXHR) {

                    if (jqXHR.status === 201) {
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
            url = '/msd/resources/metadata/uid/' + conf.uid;
        } else {
            url = '/msd/resources/metadata/' + conf.uid + '/' + conf.version;
        }

        return Q.Promise(function (resolve, reject) {

            $.ajax({
                type: 'GET',
                url: self.o.url + url + "?full=true&dsd=true",
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
