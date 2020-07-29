'use strict';

class NxAlert{
    /**
     * Creates alert
     * @param element
     * @param options {Object}
     */
    constructor(element, options) {
        this.options = {
            containerHtml: `<div class="alerts-wrap" data-alerts-wrap></div>`,
            elementHtml: `<div class="alert-el" data-alert-el></div>`,
            count: 0,
            noticeTimeout: 3000,
            maxNotice: 5
        };

        this.className = {
            alertsWrap: 'alerts-wrap',
            alertEl: 'alert-el',
            show: 'show',
            removing: 'removing'
        };

        this.dataName = {
            alertsWrap: 'alerts-wrap',
            alertEl: 'alert-el',
        };

        this.el = element;

        window.nx.helpers.extend(true, this, options);

        this.opened = [];
    }

    /**
     * Shows alert
     * @param content {String}
     * @param theme {String}
     */
    show(content, theme){
        let $alertsWrap = document.querySelector(`[data-${this.dataName.alertsWrap}]`);

        if (!$alertsWrap) $alertsWrap = this.createAlertsWrap();

        let $alertEl = this.createAlertElement($alertsWrap);

        if (theme) $alertEl.classList.add(`${this.className.alertEl}_${theme}`);

        $alertEl.innerHTML = content;

        setTimeout(() => {
            $alertEl.classList.add(this.className.show);
        });

        $alertEl.addEventListener('click', this.close.bind(this));

        this.opened.push({
            id: Number(this.options.count),
            timeout: this.hide($alertEl, this.options.count)
        });

        this.checksCount();

        this.options.count += 1;
    }

    /**
     * Hides alert
     * @param $alertEl {HTMLDivElement}
     * @param id {String|Number}
     * @returns {number}
     */
    hide($alertEl, id ){
        return setTimeout(() => {
            $alertEl.classList.remove(this.className.show);
            this.removeElement(id);
        }, this.options.noticeTimeout);
    }

    /**
     * Remove alert dom element
     * @param id {Number}
     */
    removeElement(id){
        for(let i = 0; i < this.opened.length; i++){
            if (Number(id) === this.opened[i].id) {
                clearTimeout(this.opened[i].timeout);
                this.opened.splice(i, 1);
            }
        }

        let $curentEl = document.querySelector(`[data-${this.dataName.alertEl}="${id}"]`),
            transitionDuration = window.getComputedStyle($curentEl).transitionDuration;


        transitionDuration = transitionDuration.replace('s', '');
        transitionDuration = transitionDuration * 1000;

        $curentEl.classList.add(this.className.removing);

        setTimeout(() => {
            $curentEl.remove();
        }, transitionDuration);
    }

    /**
     * Close current alert
     * @param e {Event}
     */
    close(e){
        e.preventDefault();
        let $target = e.currentTarget,
            id = $target.getAttribute(`data-${this.dataName.alertEl}`);

        $target.classList.remove(this.className.show);
        this.removeElement(id);
    }

    /**
     * Checks max open alerts count
     * @returns {boolean}
     */
    checksCount(){
        if (this.opened.length <= this.options.maxNotice) return false;

        let $lastAlert = document.querySelectorAll(`[data-${this.dataName.alertsWrap}] .show[data-${this.dataName.alertEl}]:not(${this.className.removing})`);

        $lastAlert = $lastAlert[$lastAlert.length - 1];
        if ($lastAlert) {
            let lastAlertId = $lastAlert.getAttribute(`data-${this.dataName.alertEl}`);
            this.removeElement(lastAlertId);
        }

        return true;
    }

    /**
     * Creates aler dom elemetn
     * @param $alertsWrap {HTMLDivElement}
     * @returns {HTMLDivElement}
     */
    createAlertElement($alertsWrap) {
        let $el = document.createElement('div');

        $el.setAttribute(`data-${this.dataName.alertEl}`, this.options.count);
        $el.className = this.className.alertEl;

        $alertsWrap.prepend($el);

        return $el;
    }

    /**
     * Created dom alerts wrap
     * @returns {HTMLDivElement}
     */
    createAlertsWrap() {
        let $wrap = document.createElement('div');

        $wrap.setAttribute(`data-${this.dataName.alertsWrap}`, '');
        $wrap.className = this.className.alertsWrap;

        document.body.append($wrap);

        return $wrap;
    }
}

export default NxAlert;