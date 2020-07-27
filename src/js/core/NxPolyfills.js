import elementClosest from 'element-closest';

class NxPolyfills {
    constructor() {
        this.options = {};

        this.className = {
            collapsing: 'collapsing'
        }

        this.ElementPrototype = window.Element.prototype;

        this.init();
    }

    init() {
        this.siblingsElement();
        this.nextAll();
        elementClosest(window);
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
}

export default NxPolyfills;
