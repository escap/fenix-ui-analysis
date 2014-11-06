/*global require*/

// relative or absolute path of Components' main.js
//URL resolution relative to the location of this file
require([
    './js/paths'
], function (Analysis) {

    var override = {
        'lib': './js/lib'
    };

    /*
     @param: prefix of Components paths to reference them also in absolute mode
     @param: paths to override
     @param: callback function
     */
    //URL resolution relative to the location of this file
    Analysis.initialize('./js', override, function () {

        require([
            'fx-ana/start'
        ], function (Analysis){

            new Analysis().init();
        });

    });

});