/*global require*/

var pathProjectRoot = "../../../";
var projectRoot = "./";
var submoduleRoot = '../../submodules/fenix-ui-analysis/';

require.config({
    config: {
        text: {
            useXhr: function (url, protocol, hostname, port) {
                return true;
            }
        }
    },
    paths: {
        compilerPaths: pathProjectRoot + 'submodules/fenix-ui-common/js/Compiler',
        commonPaths: pathProjectRoot + 'submodules/fenix-ui-common/js/paths',
        menuPaths: pathProjectRoot + 'submodules/fenix-ui-menu/src/js/paths',
        dashboardPaths: pathProjectRoot + 'submodules/fenix-ui-dashboard/src/js/paths',
        chartPaths: pathProjectRoot + 'submodules/fenix-ui-chart-creator/src/js/paths',
        mapPaths: pathProjectRoot + 'submodules/fenix-ui-map-creator/src/js/paths',
        tablePaths: pathProjectRoot + 'submodules/fenix-ui-table-creator/src/js/paths',
        filterPaths: pathProjectRoot + 'submodules/fenix-ui-filter/src/js/paths',
        analysisPaths: pathProjectRoot + 'submodules/fenix-ui-analysis/src/js/paths',
        reportPaths: pathProjectRoot + 'submodules/fenix-ui-reports/src/js/paths',
        visualizationPaths: pathProjectRoot + 'submodules/fenix-ui-visualization-box/src/js/paths',
        dataEditorPaths: pathProjectRoot + 'submodules/fenix-ui-DataEditor/src/js/paths',
        dsdEditorPaths: pathProjectRoot + 'submodules/fenix-ui-DSDEditor/src/js/paths',
        metadataEditorPaths: pathProjectRoot + 'submodules/fenix-ui-metadata-editor/src/js/paths',
        metadataViewerPaths : pathProjectRoot + 'submodules/fenix-ui-metadata-viewer/src/js/paths',
        catalogPaths: pathProjectRoot + 'submodules/fenix-ui-catalog/src/js/paths',
        dataManagementPaths: pathProjectRoot + 'submodules/fenix-ui-data-management/src/js/paths',
        fenixMap : pathProjectRoot + 'submodules/fenix-ui-map/src/paths'
    }
});

require([
    "compilerPaths",
    "commonPaths",
    "filterPaths",
    "analysisPaths",
    "catalogPaths",
    "visualizationPaths",
    "tablePaths",
    "metadataViewerPaths",
    "chartPaths",
    "mapPaths",
    "reportPaths",
    "fenixMap"
], function (Compiler, Common, Filter, Analysis, Catalog, Box, Table, MetadataViewer, ChartCreator, MapCreator, Report, Map) {

    'use strict';

    var submodules_path = projectRoot + '../../submodules/';

    var commonConfig = Common;
    commonConfig.baseUrl = submodules_path + 'fenix-ui-common/js';

    var catalogConfig = Catalog;
    catalogConfig.baseUrl = submodules_path + 'fenix-ui-catalog/src/js';

    var analysisConfig = Analysis;
    analysisConfig.baseUrl = submodules_path + 'fenix-ui-analysis/src/js';

    var boxConfig = Box;
    boxConfig.baseUrl = submodules_path + 'fenix-ui-visualization-box/src/js';

    var filterConfig = Filter;
    filterConfig.baseUrl = submodules_path + 'fenix-ui-filter/src/js';

    var tableConfig = Table;
    tableConfig.baseUrl = submodules_path + 'fenix-ui-table-creator/src/js';

    var metadataViewerConfig = MetadataViewer;
    metadataViewerConfig.baseUrl = submodules_path + 'fenix-ui-metadata-viewer/src/js';

    var chartConfig = ChartCreator;
    chartConfig.baseUrl = submodules_path + 'fenix-ui-chart-creator/src/js';

    var mapCreatorConfig = MapCreator;
    mapCreatorConfig.baseUrl = submodules_path + 'fenix-ui-map-creator/src/js';

    var reportConfig = Report;
    reportConfig.baseUrl = submodules_path + 'fenix-ui-reports/src/js';

    var mapConfig = Map;
    mapConfig.baseUrl = submodules_path + 'fenix-ui-map';

    Compiler.resolve([commonConfig, catalogConfig, filterConfig, analysisConfig, boxConfig, tableConfig, metadataViewerConfig, chartConfig, mapCreatorConfig, reportConfig, mapConfig],
        {
            placeholders: {"FENIX_CDN": "http://fenixrepo.fao.org/cdn"},

            config: {

                config: {

                    //Set the config for the i18n
                    i18n: {
                        locale: 'en'
                    }
                },

                // The path where your JavaScripts are located
                baseUrl: pathProjectRoot + '/src/js',

                // Specify the paths of vendor libraries
                paths: {

                    //nls: projectRoot + "i18n",
                    //config: projectRoot + "config",
                    //json: projectRoot + "json",

                    test: projectRoot + submoduleRoot + "test",

                    domReady: "{FENIX_CDN}/js/requirejs/plugins/domready/2.0.1/domReady",
                    i18n: "{FENIX_CDN}/js/requirejs/plugins/i18n/2.0.4/i18n",
                    text: '{FENIX_CDN}/js/requirejs/plugins/text/2.0.12/text',


                },

                // Underscore and Backbone are not AMD-capable per default,
                // so we need to use the AMD wrapping of RequireJS
                shim: {},

                //waitSeconds : 15

                // For easier development, disable browser caching
                // Of course, this should be removed in a production environment
                //, urlArgs: 'bust=' +  (new Date()).getTime()
            }
        });

    // Bootstrap the application
    require([
        'loglevel',
        'test/js/test',
        'domReady!'
    ], function (log, Test) {

        //trace, debug, info, warn, error, silent
        log.setLevel('silent');

        log.warn("~~~~~ FENIX Analysis: test");
        log.info("===== Start testing:...");

        Test.start();

        log.info("===== End testing");

    });
});