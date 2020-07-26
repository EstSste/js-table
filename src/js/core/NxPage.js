"use strict";

import Nx from './Nx';

class NxPage extends Nx{
    constructor() {
        super();
    }

    removePaginationFromUrl() {
        const location = window.location.href.replace(/\?page=\d+/, '')
            .replace('&', '?');

        window.history.pushState({}, null, location);
    }
}

export default NxPage

