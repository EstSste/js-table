"use strict";

import Nx from './Nx';

class NxPageLoad extends Nx{
    constructor() {
        super();

        this.dataName = {
        };

        this.init();
    }

    init(){
        this.bindsEvent();
    }

    //Method for all events
    bindsEvent(){
        document.addEventListener('DOMContentLoaded', () => {
            window.nx.helpers.isTouch();
            window.nx.helpers.isIE();
            window.nx.initPlugins();
        });

        window.addEventListener('resize', () => {
            window.nx.helpers.isTouch();
            window.nx.helpers.isIE();
        });
    }
}

export default NxPageLoad;