define(function () {

    var config = {

        paths: {
            'fx-ana/analysis': 'analysis',
            'fx-ana/controllers': 'analysis/controllers',
            'fx-ana/html': '../html',
            'fx-ana/js': './',
            'fx-ana/json': '../json',
            'fx-ana/structures': 'structures',
            'fx-ana/start': './start',
            'fx-ana/utils': 'analysis/utils',
            'fx-ana/widgets': 'analysis/widgets',
            //Third party libs
            'bootstrap': '{FENIX_CDN}/js/bootstrap/3.2/js/bootstrap.min',
            //'draggabilly': '{FENIX_CDN}/js/draggabilly/1.1.1/dist/draggabilly.pkgd.min',
            'draggabilly': '{FENIX_CDN}/js/draggabilly/dist/draggabilly.pkgd.min',
            'highcharts': '{FENIX_CDN}/js/highcharts/4.0.4/js/highcharts-all',
            'jquery': '{FENIX_CDN}/js/jquery/2.1.1/jquery.min',
            'jqwidgets': '{FENIX_CDN}/js/jqwidgets/3.1/jqx-light',
            'pnotify': '{FENIX_CDN}/js/pnotify/2.0.1/pnotify.core',
            'tweenmax': '{FENIX_CDN}/js/greenSock/1.15.0/src/minified/TweenMax.min',
            'text': '{FENIX_CDN}/js/requirejs/plugins/text/2.0.12/text',
            'mbExtruder': '{FENIX_CDN}/js/jquery.mb.extruder/2.5.5/inc/mbExtruder',
            'jquery.mb.flipText': '{FENIX_CDN}/js/jquery.mb.extruder/2.5.5/inc/jquery.mb.flipText',
            'jquery.hoverIntent': '{FENIX_CDN}/js/jquery.hoverIntent/1.0/jquery.hoverIntent',
            'amplify' : '{FENIX_CDN}/js/amplify/1.1.2/amplify.min'
        },
        shim: {
            'highcharts': {
                deps: ['jquery']
            },
            'jqwidgets': {
                deps: ['jquery']
            },
            'bootstrap': {
                deps: ['jquery']
            },
            'jquery.mb.flipText': {
                deps: ['jquery']
            },
            'jquery.hoverIntent': {
                deps: ['jquery']
            },
            'mbExtruder': {
                deps: ['jquery', 'jquery.mb.flipText', 'jquery.hoverIntent']
            },
            'amplify' : {
                deps : ['jquery']
            }
        }
    };

    return config;
});