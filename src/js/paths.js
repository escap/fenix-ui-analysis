define(function () {

    var config = {

        paths: {
            'fx-analysis/start': './analysis',
            'fx-analysis/html': '../html',
            'fx-analysis/js': './',
            'fx-analysis/config' :  '../config',
            'fx-analysis/nls' :  '../nls',

            //3rd party libs
            'jquery': '{FENIX_CDN}/js/jquery/2.1.1/jquery.min',
            'handlebars': "{FENIX_CDN}/js/handlebars/2.0.0/handlebars",
            'amplify' : '{FENIX_CDN}/js/amplify/1.1.2/amplify.min',
            underscore: "{FENIX_CDN}/js/underscore/1.7.0/underscore.min",
            i18n: "{FENIX_CDN}/js/requirejs/plugins/i18n/2.0.4/i18n",
            text: '{FENIX_CDN}/js/requirejs/plugins/text/2.0.12/text',
            bootstrap : "{FENIX_CDN}/js/bootstrap/3.3.4/js/bootstrap.min",
            loglevel: '{FENIX_CDN}/js/loglevel/1.4.0/loglevel'
        },

        shim: {
            bootstrap : {
                deps : ['jquery']
            },
            underscore: {
                exports: '_'
            },
            'amplify' : {
                deps : ['jquery']
            },
            handlebars: {
                exports: 'Handlebars'
            }
        }
    };

    return config;
});