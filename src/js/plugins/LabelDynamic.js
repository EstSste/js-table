'use strict';

//init
// $(function() {
//     $('[data-dynamic-inp]').each( (i,e) => {
//         let dynamicFormLabel = new NxDynamicFormLabel(e);
//     });
// });

class LabelDynamic{
    constructor(element, options) {
        this.options = {
            valLength: 0
        };

        this.className = {
            focused: 'focused'
        };

        this.dataName = {
            dynamicInp: 'dynamic-inp',
            dynamicLabel: 'dynamic-label'
        };

        this.$el = element;

        if (this.$el) {
            this.$parent = this.$el.closest(`[data-${this.dataName.dynamicLabel}]`);
        }

        window.nx.helpers.extend(true, this, options);
    }

    //Method for run all class methods
    init($container){
        const $labels = $container.querySelectorAll(`[data-${this.dataName.dynamicInp}]`);

        if (!$labels.length) return false;

        $labels.forEach((el) => {
            const labelDynamic = new LabelDynamic(el);

            labelDynamic.bindEvents();
            labelDynamic.switchFocusClass();
        });
    }

    //Method for all events
    bindEvents(){
        this.onElementFocusIn = this.onElementFocusIn.bind(this);
        this.onElementFocusOut = this.onElementFocusOut.bind(this);
        this.onLabelClick = this.onLabelClick.bind(this);

        this.$el.addEventListener('focus', this.onElementFocusIn, true);
        this.$el.addEventListener('focusout', this.onElementFocusOut, true);
        this.$parent.addEventListener('click', this.onLabelClick, true);
    }

    /**
     * Element event on focus in
     * @param e - event
     */
    onElementFocusIn(e){
        e.preventDefault();

        this.$parent.classList.add(this.className.focused);

        return false;
    }

    /**
     * Element event on focus out
     * @param e - event
     */
    onElementFocusOut(e){
        e.preventDefault();
        this.options.valLength = e.target.value.length;

        this.switchFocusClass();
    }

    /**
     * Element event on click
     * @param e - event
     */
    onLabelClick(e){
        e.preventDefault();
        this.onElementFocusIn(e);
    }

    // Element event on focus out
    switchFocusClass(){
        if (this.options.valLength > 0 || this.$el.autofocus || this.$el.getAttribute('placeholder')) {
            this.$parent.classList.add(this.className.focused);
        } else {
            this.$parent.classList.remove(this.className.focused);
        }
    }
}

export default LabelDynamic;