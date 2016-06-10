define([
    'loglevel',
    'jquery',
    'underscore',
    'fx-analysis/start',
    'i18n!test/nls/labels'
], function (log, $, _, Analysis) {

    'use strict';

    var s = {
            STANDARD: "#standard"
        },
        instances = [],
        environment = "production";

    function Test() {
    }

    Test.prototype.start = function () {

        log.trace("Test started");

        this._render();

    };

    Test.prototype._render = function () {

        this._renderStandard();
    };

    Test.prototype._renderStandard = function () {

        var analysis = this.createInstance({
            el: s.STANDARD,
            environment : environment,
            catalogDefaultDelectors : ['contextSystem', "dataDomain","resourceType" ],
            catalogSelectorsRegistry : {
                contextSystem : {
                    selector : {
                        id : "dropdown",
                        source : [
                            {value : "uneca", label : "UNECA"},
                            {value : "FAOSTAT", label : "FAOSTAT"}
                        ],
                        default : ["uneca"],
                        hideSummary : true
                    },

                    template : {
                        hideRemoveButton : false
                    },

                    format : {
                        output : "enumeration",
                        metadataAttribute: "dsd.contextSystem"
                    }
                }
            }
        });
    };

    //Utils

    Test.prototype.createInstance = function (params) {

        var instance = new Analysis(params);

        instances.push(instance);

        return instance;
    };

    return new Test();

});