/*global define, alert, console*/
define([
    'jquery',
    'fx-ana/config/services',
    'fx-ana/config/services-default'
    //'text!fx-ana/json/request.json'
], function ($, S, DS) {

    'use strict';

    var defaultOptions = {
        url: S.SERVICES_BASE_ADDRESS || DS.SERVICES_BASE_ADDRESS,
        method: 'GET'
    };

    function Bridge(opts) {

        this.o = {};

        $.extend(true, this.o, defaultOptions, opts);
    }

    Bridge.prototype.getResource = function () {

        var url;

        if (this.o.query.hasOwnProperty('model') && ! this.o.query.model.hasOwnProperty('version')) {
            url = '/resources/uid/' + this.o.query.model.uid;
        } else {
            url = '/resources/' + this.o.query.model.uid + '/' + this.o.query.model.version;
        }

        $.ajax({
            type: this.o.method,
            url: this.o.url + url,
            context: this,
            contentType: 'application/json',
            data: {dsd: true, full: true},
            success: this.o.query.success,
            error: $.proxy(function (err) {

                console.error(err);

                if (this.o.query.error && typeof this.o.query.error === 'function') {
                    this.o.query.error.call();
                } else {
                    alert("IPI-side Problems");
                }

            }, this)
        });
    };

    Bridge.prototype.query = function (conf) {

        this.o.query = {};

        $.extend(true, this.o.query, conf);

        //this.createBodyRequest();
        this.getResource();
    };

    Bridge.prototype.getResourceMetadata = function (conf) {

        console.log(conf)

        return


        this.o.query = {};

        $.extend(true, this.o.query, conf);

        var url;

        if (this.o.query.hasOwnProperty('model') && ! this.o.query.model.hasOwnProperty('version')) {
            url = '/resources/metadata/uid/' + this.o.query.model.uid;
        } else {
            url = '/resources/metadata/' + this.o.query.model.uid + '/' + this.o.query.model.version;
        }

        $.ajax({
            type: this.o.method,
            url: this.o.url + url,
            context: this,
            contentType: 'application/json',
            data: {dsd: true, full: true},
            success: this.o.query.success,
            error: $.proxy(function (err) {

                console.error(err);

                if (this.o.query.error && typeof this.o.query.error === 'function') {
                    this.o.query.error.call();
                } else {
                    alert("IPI-side Problems");
                }

            }, this)
        });
    };

    /* Bridge.prototype.createBodyRequest = function () {

     var r = JSON.parse(request);
     r.filter.metadata.uid.push({"enumeration": this.o.uid});

     this.o.body = JSON.stringify(r);
     };*/

    return Bridge;
});
