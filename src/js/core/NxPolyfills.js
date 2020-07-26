class NxPolyfills {
    constructor() {
        this.options = {
            transitionSpeed: 300
        };

        this.className = {
            collapsing: 'collapsing'
        }

        this.ElementPrototype = window.Element.prototype;

        this.init();
    }

    init() {
        this.siblingsElement();
        this.slideUp();
        this.slideDown();
        this.slideToggle();
    }

    siblingsElement() {
        if (typeof this.ElementPrototype.siblingsElement === 'function') return false;

        this.ElementPrototype.siblingsElement = function() {
            let siblings = [],
                sibling = this;

            while (sibling.previousSibling) {
                sibling = sibling.previousSibling;
                sibling.nodeType === 1 && siblings.push(sibling);
            }

            sibling = this;

            while (sibling.nextSibling) {
                sibling = sibling.nextSibling;
                sibling.nodeType === 1 && siblings.push(sibling);
            }

            return siblings;
        };
    }

    nextAll() {
        if (typeof this.ElementPrototype.nextAll === 'function') return false;

        this.ElementPrototype.nextAll = function() {
            const nextElements = []
            let nextElement = element

            while(nextElement.nextElementSibling) {
                nextElements.push(nextElement.nextElementSibling)
                nextElement = nextElement.nextElementSibling
            }

            return nextElements
        };
    }


    /**
     * SlideUp
     *
     * @param {Number} duration
     * @returns {Promise<boolean>}
     */
    slideUp(duration = this.options.transitionSpeed) {
        if (typeof this.ElementPrototype.slideUp === 'function') return null;
        let _this = this;

        this.ElementPrototype.slideUp = function() {
            return new Promise((resolve, reject) => {
                let element = this;

                if (!element) return resolve(false);

                element.classList.add(_this.className.collapsing);

                element.style.height = element.offsetHeight + 'px';
                element.style.transitionProperty = `height, margin, padding`;
                element.style.transitionDuration = duration + 'ms';
                element.offsetHeight;
                element.style.overflow = 'hidden';
                element.style.height = '0px';
                element.style.paddingTop = '0px';
                element.style.paddingBottom = '0px';
                element.style.marginTop = '0px';
                element.style.marginBottom = '0px';

                setTimeout(() => {
                    element.classList.remove(_this.className.collapsing);

                    element.style.display = 'none';
                    element.style.removeProperty('height');
                    element.style.removeProperty('padding-top');
                    element.style.removeProperty('padding-bottom');
                    element.style.removeProperty('margin-top');
                    element.style.removeProperty('margin-bottom');
                    element.style.removeProperty('overflow');
                    element.style.removeProperty('transition-duration');
                    element.style.removeProperty('transition-property');
                    resolve(false);
                }, duration)
            });
        };
    }

    /**
     * SlideDown
     *
     * @param {Number} duration
     * @returns {Promise<boolean>}
     */
    slideDown(duration = this.options.transitionSpeed) {
        if (typeof this.ElementPrototype.slideDown === 'function') return null;

        let _this = this;

        this.ElementPrototype.slideDown = function() {
            return new Promise((resolve, reject) => {
                let element = this;

                if (!element) return resolve(false);

                element.classList.add(_this.className.collapsing);

                element.style.removeProperty('display');
                let display = window.getComputedStyle(element).display;

                if (display === 'none')
                    display = 'block';

                element.style.display = display;
                let height = element.offsetHeight;
                element.style.overflow = 'hidden';
                element.style.height = '0px';
                element.style.paddingTop = '0px';
                element.style.paddingBottom = '0px';
                element.style.marginTop = '0px';
                element.style.marginBottom = '0px';
                element.offsetHeight;
                element.style.transitionProperty = `height, margin, padding`;
                element.style.transitionDuration = duration + 'ms';
                element.style.height = height + 'px';
                element.style.removeProperty('padding-top');
                element.style.removeProperty('padding-bottom');
                element.style.removeProperty('margin-top');
                element.style.removeProperty('margin-bottom');

                setTimeout(() => {
                    element.classList.remove(_this.className.collapsing);

                    element.style.removeProperty('height');
                    element.style.removeProperty('overflow');
                    element.style.removeProperty('transition-duration');
                    element.style.removeProperty('transition-property');
                }, duration)
            });
        };
    }

    /**
     * SlideToggle
     *
     * @param {Number} duration
     * @returns {Promise<boolean>}
     */
    slideToggle(duration = this.options.transitionSpeed) {
        if (typeof this.ElementPrototype.slideToggle === 'function') return null;

        this.ElementPrototype.slideToggle = function() {
            let element = this;

            if (window.getComputedStyle(element).display === 'none') {
                return element.slideDown(duration);
            } else {
                return element.slideUp(duration);
            }
        };

    }
}

export default NxPolyfills;
