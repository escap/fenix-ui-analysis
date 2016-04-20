/*global define, amplify*/
define([
    'jquery',
    'underscore',
    'loglevel',
    'fx-analysis/config/errors',
    'fx-analysis/config/events',
    'fx-analysis/config/config',
    'fx-analysis/config/config-default',
    'amplify'
], function ($, _, log, ERR, EVT, C, CD) {

    'use strict';

    var opts = {
        lang: 'EN'
    };

    function Utils() {

        $.extend(true, this, opts, CD, C);

        return this;
    }

    return new Utils();
});