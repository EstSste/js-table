'use strict';

class NxCollapse{
    constructor(element, options) {
        this.options = {
            transitionSpeed: 300
        };

        this.className = {
            open: 'open',
        };

        this.dataName = {
            container: 'collapse-container',
            wrapper: 'collpase-wrap',
            toggle: 'collapse-btn'
        };

        this.el = element || `[data-${this.dataName.toggle}]`;

        window.nx.helpers.extend(true, this, options);

        this.init();
    }

    //Method for run all class methods
    init(){
        this.bindsEvent();
    }

    //Method for all events
    bindsEvent(){
        window.addEventListener('load', this.updateStateOnLoad.bind(this))
        document.querySelectorAll(this.el).forEach((el) => {
            el.addEventListener('click', this.collapseHandler.bind(this));
        });
    }

    collapseHandler(e) {
        e.preventDefault();
        let $btn = e.currentTarget,
            $toggleContainer = $btn.nextElementSibling,
            $toggleWrapper = $btn.closest(`[data-${this.dataName.wrapper}]`);

        if ($toggleContainer.classList.contains('collapsing')) return false;

        $toggleWrapper.classList.toggle(this.className.open);
        $toggleContainer.slideToggle();
    }

    updateStateOnLoad() {
        let $toggleWrapper = document.querySelectorAll(`[data-${this.dataName.wrapper}]`);

        $toggleWrapper.forEach((el) => {
            let $toggleContainer = el.querySelector(`[data-${this.dataName.container}]`);

            $toggleContainer.style.display = (el.classList.contains(this.className.open)) ? 'block' : 'none';
        });
    }
}

export default NxCollapse;