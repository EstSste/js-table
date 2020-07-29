import elementClosest from 'element-closest';

class NxPolyfills {
    /**
     * Polyfills
     */
    constructor() {
        this.options = {};

        this.className = {
            collapsing: 'collapsing'
        }

        this.ElementPrototype = window.Element.prototype;

        this.init();
    }

    /**
     * Init all Polyfills
     */
    init() {
        this.siblingsElement();
        this.nextAll();
        elementClosest(window);
    }

    /**
     * Returns all siblings
     * @returns {boolean}
     */
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

    /**
     * Returns all next Nodes
     * @returns {boolean}
     */
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
}

export default NxPolyfills;
