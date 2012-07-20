define(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['flotr2', 'bonzo'], function (Flotr, bonzo) {
            // Also create a global in case some scripts
            // that are loaded still are looking for
            // a global even when an AMD loader is in use.
            return factory(root, Flotr, bonzo);
        });
    } else {

        // Browser globals
        root.envision = factory(root, root.Flotr, root.bonzo);
    }
}(this, function (root, Flotr, bonzo) {


