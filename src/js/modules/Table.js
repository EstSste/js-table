'use strict';

import TableRender from './TableRender';
import TableSort from './TableSort';
import TablePagination from './TablePagination';
import TableRowDetails from './TableRowDetails';
import TableSearch from './TableSearch';

class Table {
    /**
     * Table processing
     * @param count {Number}
     * @param actions {Object}
     */
    constructor(count, actions) {

        this.options = {
            elementsCount: count || 1000,
            isLoading: false,
            delay: 3
        };

        this.table = {
            columns: [
                {
                    name: 'id',
                    value: 'id',
                    isSorted: false,
                },
                {
                    name: 'firstName',
                    value: 'firstName',
                    isSorted: false,
                },
                {
                    name: 'lastName',
                    value: 'lastName',
                    isSorted: false,
                },
                {
                    name: 'email',
                    value: 'email',
                    isSorted: false,
                },
                {
                    name: 'phone',
                    value: 'phone',
                    isSorted: false,
                }
            ],
            limit: 50,
            page: 1,
        };

        this.actions = {
            ...actions
        };

        this.dataName = {
            table: 'table',
            tableHead: 'table-head',
            pagination: 'table-pagination',
            tableActions: 'table-actions',
            tableUpdate: 'table-update',
            tableWrap: 'table-wrap',
            tableSearch: 'table-search'
        };

        this.className = {
            hidden: 'hidden',
        };

        this.apiUrl = `http://www.filltext.com/?rows=${this.options.elementsCount}&id={number|1000}&firstName={firstName}&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&adress={addressObject}&description={lorem|32}`;

        if (this.options.elementsCount > 50) this.apiUrl += `&delay=${this.options.delay}`;

        this.$table = document.querySelector(`[data-${this.dataName.table}]`);
        this.$tableWrap = document.querySelector(`[data-${this.dataName.tableWrap}]`);
        this.$pagination = document.querySelector(`[data-${this.dataName.pagination}]`);
        this.$search = document.querySelector(`[data-${this.dataName.tableSearch}]`);
    }

    /**
     * Receives data
     * @returns {Promise<null>}
     */
    async getData(){
        let data = null;

        this.options.isLoading = true;
        window.nx.helpers.insertPreloader(document.body, false, 'content');

        this.$tableWrap.classList.add(this.className.hidden);

        try {
            const response =  await fetch(this.apiUrl);
            data = await response.json();
            window.nx.alert.show('Данные успешно загружены', 'success');
        } catch (e) {
            console.log(e);
            window.nx.alert.show('Во время загрузки, возникла ошибка', 'error');
            // throw new Error('Во время загрузки, возникла ошибка');
        } finally {
            this.options.isLoading = false;
            window.nx.helpers.hidePreloader(document.body, false);
        }

        this.$tableWrap.classList.remove(this.className.hidden);

        return data;
    }

    // Returns data length
    get dataLength(){
        return (this.data && this.data.length) ? this.data.length : 0;
    }

    // Calc max page
    get currentPageMax(){
        return (this.table.limit * this.table.page < this.dataLength) ? this.table.limit * this.table.page : this.dataLength.length;
    }

    // Calc min page
    get currentPageMin(){
        return (this.table.page - 1) * this.table.limit;
    }

    // Returns data with limit and for current page
    get products(){
        return this.data.slice(this.currentPageMin, this.currentPageMax);
    }

    // Returns tatal pages
    get totalPages(){
        return Math.ceil(this.dataLength/this.table.limit)
    }

    /**
     * Init Table
     * @returns {boolean}
     */
    async init(){
        await this.getData().then(res => {
            this.data = res;
            this.dataDefault = [...this.data];
            this.table.totalPages = this.totalPages;
        }).catch(err => {
            console.log(err);
            window.nx.alert.show('Что-то пошло не так', 'error');
            // throw new Error('Что-то пошло не так');
        });

        if (!this.data) return false;

        this.render();
    }

    /**
     * Handler for table update
     * @param e
     * @returns {boolean}
     */
    updateTable(e){
        const type = e.currentTarget.getAttribute(`data-${this.dataName.tableUpdate}`);

        if (type === 'clear') {
            this.clearFilters();
            return false;
        }

        let Constructor = this.actions[type];

        try {
            Constructor = new Constructor(this.prepareData());
        } catch (e) {
            console.warn(`Конструктор ${type} не найден`, e);
            return false;
        }

        try {
            const {table, data} = Constructor.updateData(e);
            this.updateProperties(type, data, table);

            this.render('body');
        } catch (e) {
            console.log(e);
            throw new Error('Конструктор должен содержать метод updateData');
        }

        this.checkFilters();
    }

    /**
     * Cleans all filters
     */
    clearFilters(){
        for (let i in this.actions){
            try {
                const Constructor = new this.actions[i](this.prepareData())
                const {data, table} = Constructor.clear();
                this.updateProperties('clear', data, table);
            } catch (e) {
                console.log(e);
                throw new Error('Конструктор должен содержать метод clear');
            }
        }

        this.checkFilters();
        this.render();
    }

    /**
     * Checks applied filters
     */
    checkFilters(){
        const $clearLink = document.querySelectorAll(`[data-${this.dataName.tableUpdate}="clear"]`);
        const method = (this.table.currentSort || this.table.page > 1 || this.table.value) ? 'remove' : 'add';

        $clearLink.forEach(el => {
            el.classList[method](this.className.hidden);
        });
    }

    /**
     * Updates table data and properties
     * @param type {String}
     * @param data {Array}
     * @param table {Object}
     */
    updateProperties(type, data, table) {
        if (table) this.table = {...this.table, ...table};
        if (data) {
            this.data = [...data];
            this.table.totalPages = this.totalPages;

            if (this.table.currentSort && type !== 'sort') this.data = TableSort.sort(this.table, this.data);
        }

        if (type === 'clear') this.data = [...this.dataDefault];
    }

    /**
     * Prepares data for passing to the constructor
     * @returns {{data: (Array), dataDefault: [], table: {}}}
     */
    prepareData(){
        return {
            table: this.table,
            data: this.data,
            dataDefault: this.dataDefault
        }
    }

    /**
     * Runs table render, runs (un)bind events
     * @param type {String}
     */
    render(type){
        this.unBindEvents();

        const tableRender = new TableRender(this.table, this.products);

        if (type === 'body') {
            let $rows = this.$table.querySelector(`[data-${this.dataName.tableHead}]`).siblingsElement();
            $rows.forEach(el => {
                el.remove();
            });

            this.$table.insertAdjacentHTML('beforeend', tableRender.generateBody());
        } else {
            this.$table.innerHTML = tableRender.generateFullTable();
        }

        this.$pagination.innerHTML = tableRender.generatePagination();

        this.bindEvents();
    }

    /**
     * Binds Events
     */
    bindEvents(){
        const $updateLinks = document.querySelectorAll(`[data-${this.dataName.tableUpdate}]`);
        this.updateTable = this.updateTable.bind(this);

        $updateLinks.forEach($link =>{
            const listenerType = ($link.tagName.toLowerCase() === 'input') ? 'change' : 'click';
            $link.addEventListener(listenerType, this.updateTable, true);
        });
    }

    /**
     * Unbinds Events
     */
    unBindEvents(){
        const $updateLinks = document.querySelectorAll(`[data-${this.dataName.tableUpdate}]`);

        $updateLinks.forEach($link =>{
            const listenerType = ($link.tagName.toLowerCase() === 'input') ? 'change' : 'click';
            $link.removeEventListener(listenerType, this.updateTable, true);
        });
    }

    /**
     * Destroies current Table
     */
    destroy(){
        this.unBindEvents();
        if (this.$table) this.$table.innerHTML = '';
        if (this.$pagination) this.$pagination.innerHTML = '';
        if (this.$search) this.$search.querySelector('input').value = '';
        window.table = null;
    }

    /**
     * Default Table setup
     */
    static build(){
        document.addEventListener('DOMContentLoaded', () => {
            const $tableBuild = document.querySelectorAll('[data-table-build]');

            $tableBuild.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const cnt = e.currentTarget.getAttribute('data-table-build');

                    if (window.table) window.table.destroy();

                    window.table = new Table(Number(cnt), {
                        pagination: TablePagination,
                        sort: TableSort,
                        details: TableRowDetails,
                        search: TableSearch
                    });

                    window.table.init();
                });
            });
        });
    }
}

export default Table;