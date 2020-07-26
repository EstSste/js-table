"use strict";

import Nx from './Nx';

class NxHelpers extends Nx{
    constructor() {
        super();

        this.options = {};
        this.dataName = {
            preloader: 'preloader',
            wordsDecline: 'words-decline'
        };
        this.className = {
            touch: 'has-touch',
            ie: 'msi-user',
            hidden: 'hidden'
        };

        this.$GET = this.getUrlVars();
    }

    /**
     * Method checks touch screen in deveces
     * @returns {boolean}
     */
    isTouch() {
        let touch = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;

        if (touch) {
            this.selectors.$body.classList.add(this.className.touch);
        } else {
            this.selectors.$body.classList.remove(this.className.touch);
        }

        return touch;
    }

    /**
     * Method checks user agent, and return true if agent is any IE
     * @returns {boolean}
     */
    isIE(){
        let ie = document.documentMode || /Edge/.test(navigator.userAgent);

        if (ie) {
            this.selectors.$body.classList.add(this.className.ie);
        } else {
            this.selectors.$body.classList.remove(this.className.ie);
        }

        return ie;
    }

    /**
     * Scroller to the element
     * @param btn - dom element which was clicked
     * @param options
     *          offset - offset top after scroll
     *          speed - scroll speed
     *          hash - save to window.location.hash
     */
    smoothScroll(btn, options) {
        let target = btn.hash,
            $target = $(target),
            defaults = {
                offset: 0,
                speed: 300,
                hash: false
            };

        this.extend(true, defaults, options);

        if (!$target.length) return false;

        $(this.selectors.$htmlBody).animate({
            'scrollTop': $target.offset().top - defaults.offset
        }, {
            duration: defaults.speed ,
            easing: 'linear',
            complete: () => {
                if (defaults.hash) window.location.hash = target;
            }
        });
    }

    /**
     * Method removes spaces in string
     * @param str - string
     * @returns {string}
     */
    removeSpaces(str) {
        let regExp = /\s+/g;
        return String(str).replace(regExp, '');
    }

    /**
     * Method adds spaces in string
     * @param str - string
     * @returns {string}
     */
    addSpaces(str) {
        let regExp = /(\d)(?=(\d\d\d)+([^\d]|$))/g;
        return String(str).replace(regExp, '$1 ');
    }

    /**
     * Method saves element position in dom
     * @param $el - dom element
     * @return object - location node elements
     */
    saveLocation($el) {
        return {
            $el: $el,
            $prevEl: $el.previousElementSibling || null,
            $parentEl: (!$el.previousElementSibling) ? $el.parentNode : null
        };
    }

    /**
     * Method restore element position in dom
     * @param location - object
     * @return location - object
     */
    restoreLocation(location) {
        if (location.$parentEl) {
            location.$parentEl.appendChild(location.$el);
        } else {
            location.$prevEl.after(location.$el);
        }
        return location;
    }

    /**
     * Method checks element visability in view port
     * @param $el - dom element
     * @returns {boolean}
     */
    isElementInViewport ($el) {
        if (typeof jQuery === "function" && $el instanceof jQuery) $el = $el[0];

        let rect = $el.getBoundingClientRect();

        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    /**
     * Method checks object for emptiness
     * @param object - oblect for check
     * @returns {boolean}
     */
    isEmpty(object) {
        for (let prop in object) {
            if (object.hasOwnProperty(prop)) return false;
        }

        return true;
    }

    /**
     * Method returns a cookie with the name "name" if there is, if not, then undefined
     * @param name - cookie name
     * @returns cookie_name or undefined
     */
    getCookie(name) {
        let regExp = new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"),
            matches = document.cookie.match(regExp);
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    /**
     * Set cookie
     * @param name - cookie name
     * @param value - cookie value
     * @param options - An object with additional properties for setting cookies
     *   expires - Cookie expiration time. It is interpreted differently depending on the type:
     *     Number - the number of seconds before the expiration. For example, expires: 1 - cookie per day.
     *     Date Object - Expiration Date.
     *     If expires in the past, then the cookie will be deleted.
     *     If expires is absent or 0, then the cookie will be set as a session one and will disappear when the browser is closed.
     *   path - cookie path.
     *   domain - cookie domain.
     *   secure - If true, only send the cookie over a secure connection..
     */
    setCookie(name, value, options) {
        options = {
            path: '/',
            expires: 10,
            date: new Date(),
            useUTS: false,
            ...options
        };
        let oneDayInMs = 3600 * 24 * 1000,
            updatedCookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

        if (typeof options.expires == "number" && options.expires) {
            options.date.setTime(options.date.getTime() + (Number(options.expires) * oneDayInMs));
            options.expires = options.date;
            if (options.useUTS) options.expires = options.expires.toUTCString();
        }

        for (let key in options) {
            updatedCookie += "; " + key;
            let val = options[key];
            if (val !== true) updatedCookie += "=" + val;
        }

        document.cookie = updatedCookie;
    }

    /**
     * Method delete cookie
     * @param name - название cookie,
     */
    deleteCookie(name) {
        this.setCookie(name, "", {
            'max-age': -1
        });
    }

    /**
     * Declines a word according to a number
     * Call: decline(count, ['найдена', 'найдено', 'найдены']);
     * @param number - the number with which you want to decline the word
     * @param titles - array of inclined word variants
     * @returns {string} - returns a suitable word
     */
    decline(number, titles) {
        let cases = [2, 0, 1, 1, 1, 2];
        return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10:5]];
    }

    /**
     * Records the current declension of a word when changing a number
     * @param $el - dom elemrnt with data-words="товар, товара, товаров"
     * @param cnt - (int)number
     */
    writeDecline($el, cnt) {
        if (!$el.length) return false;

        for (let i = 0; i < $el.length; i++){
            let $dec = $el[i],
                decWords = $dec.getAttribute(`data-${this.dataName.wordsDecline}`),
                arr = decWords.split(',');
            $dec.innerText = this.decline(cnt, arr);
        }
    }

    /**
     * inserts a preloader into content with various css modifiers
     * @param $el - dom element for insert preloader
     * @param replace - {bool}
     *   true - replace all inner html
     *   false - insert preloder at end (save html)
     * @param theme (not necessary) - css modificator
     */
    insertPreloader($el, replace, theme) {
        let $preloaderEl = $el.querySelector(`[data-${this.dataName.preloader}]`),
            classNameMod = theme ? 'preloader_' + theme : '',
            preloaderHtml =
                `<div class="preloader ${classNameMod}" data-preloader>
                    <div class="preloader__el"></div>
                </div>`;

        if ($preloaderEl) {
            $preloaderEl.classList.remove(this.className.hidden);
        } else {
            if (replace) {
                $el.innerHTML = preloaderHtml;
            } else {
                $el.insertAdjacentHTML('beforeend',  preloaderHtml);
            }
        }
    }

    /**
     * Hide preloader
     * @param $el - dom element with preloader
     * @param del - {boolean}
     *   true - preloader delete from DOM
     *   false or empty - preloader added class hidden
     */
    hidePreloader($el, del) {
        let $preloaderEl = $el.querySelector(`[data-${this.dataName.preloader}]`);

        if ($preloaderEl) {
            $preloaderEl.classList.add(this.className.hidden);
            if(del) $preloaderEl.remove();
        }
    }

    /**
     * Scrollbar width
     * @returns {number}
     */
    scrollbarWidth() {
        let w1 = window.offsetWidth,
            w2 = window.clientWidth;
        return (w1 - w2);
    }

    /**
     * Получение текущего адреса и добавление его в массив
     * @return {[]}
     */
    getUrlVars() {
        let vars = [],
            hash,
            hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');

        for (let i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }

        return vars;
    }

    extend() {
        let extended = (Object.prototype.toString.call( arguments[1] ) === '[object Object]') ? arguments[1] : {},
            deep = false,
            i = 0,
            length = arguments.length;

        // Check if a deep merge
        if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
            deep = arguments[0];
            i++;
        }

        // Merge the object into the extended object
        let merge = (obj) => {
            for ( let prop in obj ) {
                if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
                    // If deep merge and property is an object, merge properties
                    if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
                        extended[prop] = this.extend( true, extended[prop], obj[prop] );
                    } else {
                        extended[prop] = obj[prop];
                    }
                }
            }
        };

        // Loop through each object and conduct a merge
        for ( ; i < length; i++ ) {
            let obj = arguments[i];
            merge(obj);
        }

        return extended;
    }
}

export default NxHelpers;