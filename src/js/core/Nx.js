"use strict";
/**
 * Global main class for initialize all plugins
 * Class has 2 arguments - new Visual($container, options)
 * The $container argument takes a block in the DOM in which the plugins need to be initialized
 * $(document) by default for $container argument
 * @example
 * window.nx = new Nx($(document))
 */
class Nx {
    constructor() {
        this.selectors = {
            $body: document.querySelector('body'),
            $htmlBody: document.querySelectorAll('html, body')
        };

        this.plugins = {
            container: document,
            initialize: []
        };
    }

    /**
     * Trigger init method in all class instance
     * @param $container - container in dom for find plugin container
     */
    initPlugins($container){
        if (!this.plugins.initialize.length || !this.plugins.container && !$container) return false;

        for (let i = 0; i < this.plugins.initialize.length; i++){
            this.plugins.initialize[i].init($container || this.plugins.container);
        }
    }

    /**
     * Add new instance class for plugin init
     * @param newPlugin - object or array
     */
    addPlugin(newPlugin) {
        if (Array.isArray(newPlugin)) {
            for (let i = 0; i < newPlugin.length; i++) {
                this.plugins.initialize.push(newPlugin[i]);
            }
        } else {
            this.plugins.initialize.push(newPlugin);
        }
    }
}

export default Nx;

