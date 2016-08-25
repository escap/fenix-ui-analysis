define([
    'loglevel',
    'jquery',
    'underscore',
    'fx-analysis/start',
    'i18n!test/nls/labels'
], function (log, $, _, Analysis) {

    'use strict';

    var s = {
            STANDARD: "#standard",
            ADD_BTN: "#add-btn"
        },
        instances = [],
        environment = "develop";

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
            environment: environment,
            /*            catalog : {
             defaultSelectors : ['contextSystem', "dataDomain","resourceType" ],
             selectorsRegistry : {
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
             },*/
            catalog: false
        });

        $(s.ADD_BTN).on("click", function () {
            analysis.add({
                uid: "adam_usd_commitment",
                process: [
                    {
                        "name": "filter",
                        "parameters": {
                            "rows": {
                                "year": {
                                    "time": [
                                        {
                                            "from": 2000,
                                            "to": 2014
                                        }
                                    ]
                                }
                            }
                        }
                    },
                    {
                        "name": "pggroup",
                        "parameters": {
                            "by": [
                                "year"
                            ],
                            "aggregations": [
                                {
                                    "columns": ["value"],
                                    "rule": "SUM"
                                },
                                {
                                    "columns": ["unitcode"],
                                    "rule": "pgfirst"
                                },
                                {
                                    "columns": ["flowcategory"],
                                    "rule": "pgfirst"
                                }
                            ]
                        }
                    },
                    {
                        "name": "order",
                        "parameters": {
                            "year": "ASC"
                        }
                    }
                ]
            })
        })
    };

    //Utils

    Test.prototype.createInstance = function (params) {

        var instance = new Analysis(params);

        instances.push(instance);

        return instance;
    };

    return new Test();

});