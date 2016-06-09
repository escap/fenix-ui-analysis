/*global define*/

define(function () {

    'use strict';

    return {

        catalogDefaultSelectors: ['resourceType', 'contextSystem', 'uid'],
        catalogActions: ["download", "select"], /* , 'view' */
        //catalogBaseFilter : { test : "test"}
        //catalogSelectorsRegistry : {}
        catalogMenuExcludedItems : [],
        pulsingButtonClassName: 'first-init',

        boxConfig: {}
    }

});