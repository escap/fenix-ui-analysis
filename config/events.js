/*global define*/
define(function () {

    'use strict';

    var PREFIX = 'fx.widget.analysis.module.';

    return {
        MODULE_RESIZE : PREFIX + 'resize',
        MODULE_RESIZED : PREFIX + 'resized',
        MODULE_CLONE : PREFIX + 'clone',
        MODULE_MINIMIZE : PREFIX + 'minimize',
        MODULE_REMOVE : PREFIX + 'remove',
        MODULE_SET_WIDTH : PREFIX + 'setWidth',

        TAB_RESIZE : PREFIX + "tab.resize",
        TAB_SET_MODULE_WIDTH : PREFIX + "tab.setWidth",

        REMOVE_FROM_STACK : 'a',
        MOVE_TO_DESK : 'v'
    };

});
